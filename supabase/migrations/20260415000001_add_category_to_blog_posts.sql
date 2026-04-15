-- Add category column to blog_posts if it doesn't exist
ALTER TABLE IF EXISTS blog_posts
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Inspiration';

-- Add comment to the column
COMMENT ON COLUMN blog_posts.category IS 'e.g. Inspiration, Youth Ministry, Church News, Family Life, Testimony';
