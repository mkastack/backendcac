-- Tables Creation First
-- Members Table
create table if not exists members (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  dob date,
  gender text,
  address text,
  emergency_name text,
  emergency_phone text,
  category text default 'Full Member',
  join_date date default current_date,
  status text default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Sermons Table
create table if not exists sermons (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  speaker text not null,
  description text,
  type text, -- e.g. Sunday Service, Midweek
  date date default current_date,
  video_url text,
  audio_url text,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Events Table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date not null,
  time text,
  location text,
  category text, -- e.g. Youth, Family
  type text, -- e.g. Join Now, Register
  is_featured boolean default false,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Prayer Requests Table
create table if not exists prayer_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  request text not null,
  date date default current_date,
  status text default 'Pending', -- Pending, Prayed For
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Donations Table
create table if not exists donations (
  id uuid default gen_random_uuid() primary key,
  donor_name text not null,
  amount decimal(12,2) not null,
  purpose text,
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Blog Posts Table
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  author text,
  status text default 'Draft', -- Draft, Published
  published_at timestamp with time zone,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ministries Table
create table if not exists ministries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  leader text,
  image_url text,
  member_count integer default 0,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Storage Bucket for Church Assets
insert into storage.buckets (id, name, public) 
values ('church-assets', 'church-assets', true)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS)
alter table members enable row level security;
alter table sermons enable row level security;
alter table events enable row level security;
alter table prayer_requests enable row level security;
alter table donations enable row level security;
alter table blog_posts enable row level security;
alter table ministries enable row level security;

-- Policies
create policy "Allow all for everyone" on members for all using (true) with check (true);
create policy "Allow all for everyone" on sermons for all using (true) with check (true);
create policy "Allow all for everyone" on events for all using (true) with check (true);
create policy "Allow all for everyone" on prayer_requests for all using (true) with check (true);
create policy "Allow all for everyone" on donations for all using (true) with check (true);
create policy "Allow all for everyone" on blog_posts for all using (true) with check (true);
create policy "Allow all for everyone" on ministries for all using (true) with check (true);

-- Storage Policies
create policy "Manage Library Images" on storage.objects for all using (bucket_id = 'church-assets') with check (bucket_id = 'church-assets');

-- Enable Realtime at the end
begin;
  -- Drop existing publication if it exists to refresh
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table prayer_requests;
alter publication supabase_realtime add table sermons;
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table members;
alter publication supabase_realtime add table donations;
alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table ministries;

-- Instructions for creating the admin user:
-- Use the Supabase Dashboard under Authentication > Users > Add User
-- Email: christapostolicchurch@gmail.com
-- Password: cacbubiashie@30
