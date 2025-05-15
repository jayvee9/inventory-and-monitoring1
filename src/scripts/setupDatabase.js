const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const setupDatabase = async () => {
  try {
    // Create users table with role field
    const { error: usersTableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersTableError && usersTableError.code === '42P01') {
      // Table doesn't exist, create it
      const { error: createTableError } = await supabase.rpc('create_users_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID REFERENCES auth.users ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            PRIMARY KEY (id)
          );
        `
      });

      if (createTableError) throw createTableError;
    }

    // Create RLS policies
    const { error: rlsError } = await supabase.rpc('create_rls_policies', {
      sql: `
        -- Enable RLS
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view their own data" ON users
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Superadmins can view all users" ON users
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM users
              WHERE id = auth.uid()
              AND role = 'superadmin'
            )
          );

        CREATE POLICY "Superadmins can update all users" ON users
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM users
              WHERE id = auth.uid()
              AND role = 'superadmin'
            )
          );

        CREATE POLICY "Admins can view all users" ON users
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM users
              WHERE id = auth.uid()
              AND role = 'admin'
            )
          );

        CREATE POLICY "Supply Officers can view all users" ON users
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM users
              WHERE id = auth.uid()
              AND role = 'supply_officer'
            )
          );
      `
    });

    if (rlsError) throw rlsError;

    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

setupDatabase(); 