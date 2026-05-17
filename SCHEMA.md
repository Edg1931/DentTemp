# DenTemp — Database Schema

Postgres-flavored schema for the next phase of DenTemp: auth, profiles, jobs,
reviews, community feed, and the activity stream.

Designed for **Supabase + Next.js**, but portable to any Postgres setup.

---

## Design principles

1. **One source of truth.** Activities are written by database triggers from the
   underlying entity changes — there's no way to have a feed event without the
   thing happening.
2. **Privacy by default.** `JOB_POSTED` and `SHIFT_POSTED` never broadcast pay
   rate or job description. The feed teases — the job board is the source.
3. **Denormalize for speed.** Rating averages, comment counts, and the activity
   summary live on the row that reads them. Triggers keep them honest.
4. **Soft deletes everywhere.** A `deleted_at` column on every user-generated
   table; queries scope to `deleted_at IS NULL`.
5. **Row-level security** for everything. A pro should never be able to read
   another pro's credentials, even by accident.

---

## A. Identity & profiles

```sql
-- Base auth record (Supabase auth.users is the source; this is the public mirror)
create table users (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             citext unique not null,
  account_type      text not null check (account_type in ('professional','office_admin','staff')),
  email_verified_at timestamptz,
  last_seen_at      timestamptz,
  created_at        timestamptz not null default now(),
  deleted_at        timestamptz
);
create index on users (last_seen_at desc);

create table professional_profiles (
  user_id            uuid primary key references users(id) on delete cascade,
  display_name       text not null,
  headline           text,
  bio                text,
  avatar_url         text,
  city               text,
  state              text,
  zip                text,
  role               text not null check (role in ('hygienist','assistant','dentist','front_office','student')),
  years_experience   int,
  default_rate_cents int,
  is_available_today boolean default false,
  available_days     int[] default '{}',
  travel_radius_mi   int default 25,
  software_skills    text[] default '{}',
  languages          text[] default '{}',
  rating_avg         numeric(3,2) default 0,
  rating_count       int default 0,
  reliability_score  numeric(3,2) default 0,
  shifts_completed   int default 0,
  verified_at        timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
create index on professional_profiles (state, city);
create index on professional_profiles (role, is_available_today) where is_available_today;

create table offices (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique,
  npi             text,
  address1        text,
  address2        text,
  city            text,
  state           text,
  zip             text,
  country         text default 'US',
  software        text[],
  hours           jsonb,
  cover_url       text,
  logo_url        text,
  video_tour_url  text,
  bio             text,
  rating_avg      numeric(3,2) default 0,
  rating_count    int default 0,
  shifts_hosted   int default 0,
  verified_at     timestamptz,
  created_at      timestamptz default now(),
  deleted_at      timestamptz
);
create index on offices (state, city);

create table office_memberships (
  user_id    uuid references users(id) on delete cascade,
  office_id  uuid references offices(id) on delete cascade,
  role       text not null check (role in ('owner','manager','staff')),
  created_at timestamptz default now(),
  primary key (user_id, office_id)
);

create table office_media (
  id           uuid primary key default gen_random_uuid(),
  office_id    uuid references offices(id) on delete cascade,
  kind         text check (kind in ('image','video')),
  storage_key  text,
  position     int default 0,
  alt_text     text,
  created_at   timestamptz default now()
);

create table credentials (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid references professional_profiles(user_id) on delete cascade,
  kind            text check (kind in ('license','bls','xray','osha','anesthesia','other')),
  number          text,
  state           text,
  issued_at       date,
  expires_at      date,
  document_key    text,                       -- private storage bucket path
  status          text default 'pending' check (status in ('pending','verified','expired','rejected')),
  verified_by     uuid references users(id),
  verified_at     timestamptz,
  created_at      timestamptz default now()
);
create index on credentials (professional_id, status);
create index on credentials (expires_at) where status = 'verified';
```

## B. Jobs, shifts, applications

```sql
create table shifts (
  id              uuid primary key default gen_random_uuid(),
  office_id       uuid references offices(id) on delete cascade,
  posted_by       uuid references users(id),
  role            text not null,
  start_at        timestamptz not null,
  end_at          timestamptz not null,
  rate_low_cents  int,
  rate_high_cents int,
  software_required text[],
  certs_required text[],
  notes           text,
  status          text default 'open' check (status in ('open','offers_pending','filled','cancelled','completed')),
  filled_by       uuid references users(id),
  filled_at       timestamptz,
  created_at      timestamptz default now(),
  deleted_at      timestamptz
);
create index on shifts (status, start_at);
create index on shifts (office_id, created_at desc);

create table jobs (
  id              uuid primary key default gen_random_uuid(),
  office_id       uuid references offices(id) on delete cascade,
  posted_by       uuid references users(id),
  title           text not null,
  role            text not null,
  employment_type text check (employment_type in ('full_time','part_time','contract','associate')),
  description     text,
  salary_low_cents  int,
  salary_high_cents int,
  benefits        text[],
  status          text default 'open' check (status in ('open','paused','filled','closed')),
  created_at      timestamptz default now(),
  deleted_at      timestamptz
);

create table applications (
  id                 uuid primary key default gen_random_uuid(),
  applicant_id       uuid references users(id) on delete cascade,
  shift_id           uuid references shifts(id),
  job_id             uuid references jobs(id),
  offered_rate_cents int,
  cover_note         text,
  status             text default 'submitted' check (status in ('submitted','accepted','declined','withdrawn')),
  created_at         timestamptz default now(),
  check ((shift_id is not null)::int + (job_id is not null)::int = 1)
);
create index on applications (shift_id) where shift_id is not null;
create index on applications (job_id)   where job_id   is not null;
create index on applications (applicant_id, created_at desc);
```

## C. Reviews (two-way)

```sql
create table reviews (
  id            uuid primary key default gen_random_uuid(),
  reviewer_id   uuid references users(id) on delete cascade,
  subject_kind  text check (subject_kind in ('professional','office')),
  subject_id    uuid not null,                 -- prof user_id or office id
  shift_id      uuid references shifts(id),
  job_id        uuid references jobs(id),
  rating        int check (rating between 1 and 5),
  body          text,
  tags          text[],
  status        text default 'published' check (status in ('pending','published','flagged','removed')),
  created_at    timestamptz default now()
);
create index on reviews (subject_kind, subject_id, created_at desc);
```

A trigger recomputes `professional_profiles.rating_avg/count` or
`offices.rating_avg/count` whenever a published review changes.

## D. Community: posts, comments, reactions, media

```sql
create table media (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references users(id) on delete cascade,
  kind         text check (kind in ('image','video')),
  storage_key  text not null,
  width        int,
  height       int,
  duration_sec int,
  alt_text     text,
  size_bytes   bigint,
  status       text default 'ready',
  created_at   timestamptz default now()
);

create table posts (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid references users(id) on delete cascade,
  body            text not null check (char_length(body) <= 280),
  media_ids       uuid[] default '{}',
  visibility      text default 'public' check (visibility in ('public','followers','office_only')),
  is_pinned       boolean default false,
  reactions_count int default 0,
  comments_count  int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  deleted_at      timestamptz
);
create index on posts (created_at desc) where deleted_at is null and visibility = 'public';

create table comments (
  id                uuid primary key default gen_random_uuid(),
  post_id           uuid references posts(id) on delete cascade,
  parent_comment_id uuid references comments(id),
  author_id         uuid references users(id),
  body              text not null check (char_length(body) <= 500),
  reactions_count   int default 0,
  created_at        timestamptz default now(),
  deleted_at        timestamptz
);

create table reactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  target_kind text check (target_kind in ('post','comment','activity')),
  target_id   uuid not null,
  kind        text default 'heart' check (kind in ('heart','clap','laugh','support','insightful')),
  created_at  timestamptz default now(),
  unique (user_id, target_kind, target_id, kind)
);

create table follows (
  follower_id uuid references users(id) on delete cascade,
  followed_id uuid references users(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (follower_id, followed_id)
);

create table favorites (
  user_id    uuid references users(id) on delete cascade,
  target_kind text check (target_kind in ('professional','office','post')),
  target_id  uuid not null,
  created_at timestamptz default now(),
  primary key (user_id, target_kind, target_id)
);
```

## E. The activity stream

This is the table that powers the feed. Every meaningful event in the system
writes one row here.

```sql
create type activity_type as enum (
  'USER_JOINED',
  'JOB_POSTED',
  'SHIFT_POSTED',
  'AVAILABILITY_UPDATED',
  'POST_CREATED',
  'COMMENT_ADDED',
  'PROFILE_UPDATED',
  'REVIEW_LEFT',
  'BOOKING_CONFIRMED',
  'MILESTONE_REACHED'
);

create table activities (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid not null references users(id) on delete cascade,
  type            activity_type not null,

  -- Polymorphic target (the thing acted upon)
  target_kind     text,                    -- 'user','post','job','shift','office','comment'
  target_id       uuid,

  -- Denormalized display payload (so feed reads in ONE query)
  summary         text,                    -- "Smile Studio just posted a new shift"
  body            text,                    -- only for POST_CREATED: the actual post body
  media_urls      text[] default '{}',     -- thumbnails for card display
  city            text,                    -- "Austin, TX"

  -- Privacy & metadata
  visibility      text default 'public' check (visibility in ('public','followers','private')),
  metadata        jsonb default '{}',      -- type-specific extras

  -- Engagement counters (denormalized)
  reactions_count int default 0,
  comments_count  int default 0,

  created_at      timestamptz default now()
);

-- Critical indexes for feed performance
create index activities_global_feed on activities (created_at desc)
  where visibility = 'public';
create index activities_by_actor    on activities (actor_id, created_at desc);
create index activities_by_target   on activities (target_kind, target_id);
create index activities_by_type     on activities (type, created_at desc);
```

### What each activity type stores

| Type | actor | target | summary example | body? | metadata |
|---|---|---|---|---|---|
| `USER_JOINED` | new user | self | "Jordan T. joined as a dental assistant in Atlanta, GA" | — | `{ role }` |
| `JOB_POSTED` | office admin | job | "Smile Studio Dental posted a new RDH role in Austin, TX" | — | `{ role, employment_type }` (never salary) |
| `SHIFT_POSTED` | office admin | shift | "Smile Studio Dental just posted a new RDH shift" | — | `{ role }` (never rate, never date detail) |
| `AVAILABILITY_UPDATED` | pro | self | "Maya R. is open for same-day shifts this week" | — | `{ days, city }` — debounced to 1 per 6hr per pro |
| `POST_CREATED` | any user | post | "Maya R. shared a post" | post body (≤280) | `{ media_count }` |
| `COMMENT_ADDED` | any user | comment | "Bright Smiles Dental replied to Maya R.'s post" | comment body | `{ post_id }` |
| `PROFILE_UPDATED` | pro | self | "Sasha M. added nitrous certification" | — | `{ change: 'added_credential', cred_kind }` |
| `REVIEW_LEFT` | reviewer | review | "Dr. Allison M. reviewed Maya R." | review excerpt | `{ rating }` |
| `BOOKING_CONFIRMED` | system | shift | "Smile Studio confirmed a shift with Maya R." | — | `{ role, when_blurred }` |
| `MILESTONE_REACHED` | system | user | "Maya R. just hit 100 completed shifts on DenTemp" | — | `{ milestone }` |

### How rows get written

```sql
-- Example trigger: write activity when a shift is posted
create or replace function write_activity_shift_posted() returns trigger as $$
declare office_row offices%rowtype;
begin
  select * into office_row from offices where id = NEW.office_id;
  insert into activities (
    actor_id, type, target_kind, target_id,
    summary, city, visibility, metadata
  ) values (
    NEW.posted_by,
    'SHIFT_POSTED',
    'shift', NEW.id,
    office_row.name || ' just posted a new ' || NEW.role || ' shift',
    office_row.city || ', ' || office_row.state,
    'public',
    jsonb_build_object('role', NEW.role, 'office_id', NEW.office_id)
  );
  return NEW;
end;
$$ language plpgsql;

create trigger trg_shift_posted
  after insert on shifts
  for each row when (NEW.status = 'open')
  execute function write_activity_shift_posted();
```

Similar triggers exist for `users` (USER_JOINED), `professional_profiles`
(AVAILABILITY_UPDATED, PROFILE_UPDATED), `posts` (POST_CREATED), `comments`
(COMMENT_ADDED), `reviews` (REVIEW_LEFT), and `applications` when status flips
to 'accepted' (BOOKING_CONFIRMED).

### Real-time delivery

With Supabase, the client subscribes to the `activities` table:

```js
const channel = supabase
  .channel('public:activities')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'activities',
    filter: 'visibility=eq.public'
  }, (payload) => prependCardToFeed(payload.new))
  .subscribe();
```

That's the whole real-time pipeline. New activities stream over WebSocket; no
polling.

## F. Row-level security (RLS) — the must-haves

```sql
-- Pros can read their own credentials; nobody else can.
alter table credentials enable row level security;
create policy "own credentials" on credentials for select
  using (professional_id = auth.uid());

-- Offices can read applications to their own shifts/jobs.
alter table applications enable row level security;
create policy "office reads its own apps" on applications for select using (
  exists (
    select 1 from shifts s
      join office_memberships m on m.office_id = s.office_id
     where s.id = applications.shift_id and m.user_id = auth.uid()
  ) or exists (
    select 1 from jobs j
      join office_memberships m on m.office_id = j.office_id
     where j.id = applications.job_id and m.user_id = auth.uid()
  )
);

-- Public posts are readable by everyone signed in.
alter table posts enable row level security;
create policy "public posts" on posts for select
  using (visibility = 'public' and deleted_at is null);

-- Activities filtered by visibility.
alter table activities enable row level security;
create policy "public feed" on activities for select using (visibility = 'public');
create policy "follower feed" on activities for select using (
  visibility = 'followers' and exists (
    select 1 from follows f where f.follower_id = auth.uid() and f.followed_id = activities.actor_id
  )
);
```

## G. What this enables, page-by-page

| Page in the redesign | Tables it reads |
|---|---|
| `community.html` (feed) | `activities` + `posts` + `comments` + `reactions` (via real-time subscription) |
| `jobs.html` (job board) | `shifts` + `jobs` + `offices` + `reviews` (for office rating) |
| `profile-pro.html` | `professional_profiles` + `credentials` + `reviews` (subject = this user) |
| `profile-office.html` | `offices` + `office_media` + `shifts/jobs` (open) + `reviews` (subject = this office) |
| `dashboard.html` (office) | `shifts` + `applications` + `reviews` (left for this office) + `favorites` |
| `sign-up.html` | writes to `auth.users` + `users` + `professional_profiles` or `offices` + `office_memberships` |

## H. The "what migrates from the old DenTemp" map

If the existing `den-temp.com` has a user table, you need to map:

| Old field (typical) | New table.column |
|---|---|
| `users.email` | `users.email` |
| `users.role = 'office'` | `users.account_type = 'office_admin'` + `offices` + `office_memberships` |
| `users.role = 'pro'` | `users.account_type = 'professional'` + `professional_profiles` |
| `users.bio` | `professional_profiles.bio` |
| `users.license_*` | `credentials` (kind='license') |
| `users.bls_cert` | `credentials` (kind='bls') |
| `users.reviews` | `reviews` (preserved by subject_id) |
| `office.address` | `offices.address1/city/state/zip` |
| `office.photos` | `office_media` (kind='image') |

Existing review history is the most valuable thing to bring over — it preserves
the social capital pros have built.
