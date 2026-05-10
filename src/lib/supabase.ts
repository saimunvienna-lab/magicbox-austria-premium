import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xwbdoysnnpeavqjyyphv.supabase.co";
const SUPABASE_KEY = "sb_publishable_mVZE1pgm137VSiNzd-CI9A_8DBrs4eT";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
