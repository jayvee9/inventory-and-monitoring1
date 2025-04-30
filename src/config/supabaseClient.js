import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhmomrolqwicnzayewky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobW9tcm9scXdpY256YXlld2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTQ2NDksImV4cCI6MjA1ODYzMDY0OX0.52keJ2RWDgjKLxHwbq272NsWqNPohHhTxOpi4zqkJbY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
supabase.from('printers_peripherals').select('count').single()
  .then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Successfully connected to Supabase');
    }
  }); 