-- ====================================
-- 修复 face_scans 表的外键关系
-- ====================================
-- 此脚本用于修复 face_scans 表的外键，从 auth.users 改为 public.profiles

-- 删除旧表（如果存在）
DROP TABLE IF EXISTS public.face_scans CASCADE;

-- 重新创建 face_scans 表
CREATE TABLE IF NOT EXISTS public.face_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  face_shape TEXT NOT NULL CHECK (face_shape IN ('round', 'square', 'oval', 'long', 'heart', 'diamond')),
  confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  is_manually_adjusted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_face_scans_user_id ON public.face_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_face_scans_created_at ON public.face_scans(created_at DESC);

-- 启用 RLS
ALTER TABLE public.face_scans ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "用户可以查看自己的识别记录" ON public.face_scans;
DROP POLICY IF EXISTS "用户可以创建识别记录" ON public.face_scans;
DROP POLICY IF EXISTS "用户可以更新自己的识别记录" ON public.face_scans;
DROP POLICY IF EXISTS "face_scans_select_policy" ON public.face_scans;
DROP POLICY IF EXISTS "face_scans_insert_policy" ON public.face_scans;
DROP POLICY IF EXISTS "face_scans_update_policy" ON public.face_scans;
DROP POLICY IF EXISTS "face_scans_delete_policy" ON public.face_scans;

-- 创建新的 RLS 策略
CREATE POLICY "face_scans_select_policy" ON public.face_scans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "face_scans_insert_policy" ON public.face_scans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "face_scans_update_policy" ON public.face_scans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "face_scans_delete_policy" ON public.face_scans
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建 face-scans 存储桶（如果不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('face-scans', 'face-scans', true)
ON CONFLICT (id) DO NOTHING;

-- 删除旧的存储桶策略（如果存在）
DROP POLICY IF EXISTS "face_scans_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "face_scans_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "face_scans_delete_policy" ON storage.objects;

-- 创建存储桶策略
CREATE POLICY "face_scans_upload_policy" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'face-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "face_scans_select_policy_storage" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'face-scans');

CREATE POLICY "face_scans_delete_policy_storage" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'face-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 验证
SELECT 
  'face_scans 表已创建' as status,
  COUNT(*) as record_count 
FROM public.face_scans;

SELECT 
  'face-scans 存储桶已创建' as status,
  public as is_public 
FROM storage.buckets 
WHERE id = 'face-scans';

