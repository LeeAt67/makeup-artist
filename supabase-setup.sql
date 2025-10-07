-- =====================================================
-- 妆娘 APP - Supabase 数据库初始化脚本
-- =====================================================
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本
-- 用于创建所有必需的数据表、策略和存储桶

-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- =====================================================
-- 数据表创建
-- =====================================================

-- 用户资料表
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text,
  bio text,
  avatar_url text,
  skin_type text check (skin_type in ('dry', 'oily', 'combination', 'normal', 'sensitive')),
  skin_tone text,
  face_shape text check (face_shape in ('round', 'square', 'oval', 'long', 'heart', 'diamond'))
);

-- 妆容表
create table if not exists makeups (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text not null,
  video_url text,
  face_shapes text[] default '{}',
  scenes text[] default '{}',
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')) default 'beginner',
  likes_count integer default 0,
  views_count integer default 0,
  author_id uuid references auth.users on delete cascade not null
);

-- 收藏表
create table if not exists favorites (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  makeup_id uuid references makeups on delete cascade not null,
  unique(user_id, makeup_id)
);

-- 脸型识别历史记录表
create table if not exists face_scans (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  image_url text not null,
  face_shape text check (face_shape in ('round', 'square', 'oval', 'long', 'heart', 'diamond')) not null,
  confidence numeric(3,2) not null,
  is_manually_adjusted boolean default false
);

-- =====================================================
-- 行级安全策略 (Row Level Security)
-- =====================================================

-- 启用 RLS
alter table profiles enable row level security;
alter table makeups enable row level security;
alter table favorites enable row level security;
alter table face_scans enable row level security;

-- 用户资料表的 RLS 策略
create policy "用户可以查看所有资料" 
  on profiles for select 
  using (true);

create policy "用户只能更新自己的资料" 
  on profiles for update 
  using (auth.uid() = id);

create policy "用户注册时自动创建资料" 
  on profiles for insert 
  with check (auth.uid() = id);

-- 妆容表的 RLS 策略
create policy "所有人可以查看妆容" 
  on makeups for select 
  using (true);

create policy "认证用户可以创建妆容" 
  on makeups for insert 
  with check (auth.uid() = author_id);

create policy "作者可以更新自己的妆容" 
  on makeups for update 
  using (auth.uid() = author_id);

create policy "作者可以删除自己的妆容" 
  on makeups for delete 
  using (auth.uid() = author_id);

-- 收藏表的 RLS 策略
create policy "用户可以查看自己的收藏" 
  on favorites for select 
  using (auth.uid() = user_id);

create policy "用户可以添加收藏" 
  on favorites for insert 
  with check (auth.uid() = user_id);

create policy "用户可以删除自己的收藏" 
  on favorites for delete 
  using (auth.uid() = user_id);

-- 脸型识别历史记录表的 RLS 策略
create policy "用户可以查看自己的识别记录" 
  on face_scans for select 
  using (auth.uid() = user_id);

create policy "用户可以创建识别记录" 
  on face_scans for insert 
  with check (auth.uid() = user_id);

create policy "用户可以更新自己的识别记录" 
  on face_scans for update 
  using (auth.uid() = user_id);

-- =====================================================
-- 存储桶创建
-- =====================================================

-- 创建存储桶用于图片上传
insert into storage.buckets (id, name, public) 
values 
  ('avatars', 'avatars', true),
  ('makeups', 'makeups', true),
  ('face-scans', 'face-scans', false)
on conflict (id) do nothing;

-- =====================================================
-- 存储桶访问策略
-- =====================================================

-- 头像存储桶策略
create policy "所有人可以查看头像" 
  on storage.objects for select 
  using (bucket_id = 'avatars');

create policy "用户可以上传自己的头像" 
  on storage.objects for insert 
  with check (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "用户可以更新自己的头像" 
  on storage.objects for update 
  using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "用户可以删除自己的头像" 
  on storage.objects for delete 
  using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 妆容存储桶策略
create policy "所有人可以查看妆容图片" 
  on storage.objects for select 
  using (bucket_id = 'makeups');

create policy "认证用户可以上传妆容图片" 
  on storage.objects for insert 
  with check (
    bucket_id = 'makeups' 
    and auth.role() = 'authenticated'
  );

create policy "作者可以更新自己的妆容图片" 
  on storage.objects for update 
  using (
    bucket_id = 'makeups' 
    and auth.role() = 'authenticated'
  );

create policy "作者可以删除自己的妆容图片" 
  on storage.objects for delete 
  using (
    bucket_id = 'makeups' 
    and auth.role() = 'authenticated'
  );

-- 脸型扫描存储桶策略
create policy "用户可以查看自己的脸型扫描图片" 
  on storage.objects for select 
  using (
    bucket_id = 'face-scans' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "用户可以上传自己的脸型扫描图片" 
  on storage.objects for insert 
  with check (
    bucket_id = 'face-scans' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "用户可以删除自己的脸型扫描图片" 
  on storage.objects for delete 
  using (
    bucket_id = 'face-scans' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 触发器：自动更新 updated_at 字段
-- =====================================================

-- 创建更新时间戳函数
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 为 profiles 表创建触发器
create trigger update_profiles_updated_at 
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- 为 makeups 表创建触发器
create trigger update_makeups_updated_at 
  before update on makeups
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- 初始化完成
-- =====================================================

-- 查看创建的表
select tablename from pg_tables 
where schemaname = 'public' 
and tablename in ('profiles', 'makeups', 'favorites', 'face_scans');

-- 查看创建的存储桶
select id, name, public from storage.buckets 
where id in ('avatars', 'makeups', 'face-scans');

