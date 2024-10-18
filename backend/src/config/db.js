const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YmxjaWpqYXV1aGVjdm5zb2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDE4NDMsImV4cCI6MjA0NDQ3Nzg0M30.HLrTDZfYuWe79KLkgmZtsWIGQ7tsokyYrP7xuPvDfZ8'
;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
