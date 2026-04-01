import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://oapiwoxboqyeeyassmoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcGl3b3hib3F5ZWV5YXNzbW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzQ3OTMsImV4cCI6MjA5MDE1MDc5M30.1BurhicZTSk0oisiPbL5NIMljd8MENBX_VmvKd3QC0Q'
)