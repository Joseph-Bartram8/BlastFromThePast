-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) UNIQUE NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Bios Table
CREATE TABLE IF NOT EXISTS user_bios (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(50) NOT NULL,
  store_name VARCHAR(100) NULL,
  bio_description TEXT NULL,
  profile_picture TEXT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Markers Table
CREATE TABLE IF NOT EXISTS user_markers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  photo TEXT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  marker_type VARCHAR(50) NOT NULL CHECK (marker_type IN ('shop', 'car boot', 'collector')),
  privacy VARCHAR(20) DEFAULT 'public' CHECK (privacy IN ('public', 'private', 'friends-only')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Friends Table (For privacy settings)
CREATE TABLE IF NOT EXISTS user_friends (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  friend_id INT REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Create or Replace Function for Triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Triggers Only If They Don't Exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_user_bios_updated') THEN
    CREATE TRIGGER trigger_user_bios_updated
    BEFORE UPDATE ON user_bios
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_user_markers_updated') THEN
    CREATE TRIGGER trigger_user_markers_updated
    BEFORE UPDATE ON user_markers
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
  END IF;
END $$;
