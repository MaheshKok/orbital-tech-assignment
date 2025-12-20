-- Orbital Usage API - Database Initialization Script
-- This script runs on first container startup to initialize the database

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges (if needed for additional users)
-- GRANT ALL PRIVILEGES ON DATABASE orbital_usage TO postgres;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Orbital Usage API database initialized successfully';
END $$;
