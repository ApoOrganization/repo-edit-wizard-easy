
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wpydilkmtmgbunectxpx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweWRpbGttdG1nYnVuZWN0eHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Njc0MjUsImV4cCI6MjA2MzI0MzQyNX0.OXl2AHppGSFWSGypG_2_NZj7atD_gM_U2I7oAkpTB5w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
