-- MacStudy Supabase schema (v1)
-- Run this in the Supabase SQL editor. Every table is scoped to the signed-in
-- user with Row Level Security: users can only read and write their own rows
-- (auth.uid() = user_id).

-- ------------------------------------------------------------ profiles ---

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------ topic_progress ---

create table if not exists topic_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  module text not null,
  topic text not null,
  percent int not null default 0 check (percent between 0 and 100),
  quiz_best int not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, subject, module, topic)
);

-- ------------------------------------------------------------ xp_history ---

create table if not exists xp_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists xp_history_user_created_idx
  on xp_history (user_id, created_at desc);

-- --------------------------------------------------------------- streaks ---

create table if not exists streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current int not null default 0,
  longest int not null default 0,
  last_day date,
  freezes int not null default 0
);

-- ------------------------------------------------------------- bookmarks ---

create table if not exists bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  module text not null,
  topic text not null,
  q_index int not null,
  created_at timestamptz not null default now(),
  primary key (user_id, subject, module, topic, q_index)
);

-- ---------------------------------------------------------- mistake_deck ---

create table if not exists mistake_deck (
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  module text not null,
  topic text not null,
  q_index int not null,
  wrong_count int not null default 1,
  next_review date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, subject, module, topic, q_index)
);

create index if not exists mistake_deck_user_review_idx
  on mistake_deck (user_id, next_review);

-- ------------------------------------------------------------------- RLS ---

alter table profiles enable row level security;
alter table topic_progress enable row level security;
alter table xp_history enable row level security;
alter table streaks enable row level security;
alter table bookmarks enable row level security;
alter table mistake_deck enable row level security;

create policy "users manage own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users manage own topic progress"
  on topic_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own xp history"
  on xp_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own streak"
  on streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own bookmarks"
  on bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own mistake deck"
  on mistake_deck for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
