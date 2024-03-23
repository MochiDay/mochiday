import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials must be set in environment variables.")


class SupabaseClient:
    def __init__(self):
        self.client = create_client(SUPABASE_URL, SUPABASE_KEY)

    def insert_job(self, job):
        self.client.table("jobs").insert(job).execute()


        
