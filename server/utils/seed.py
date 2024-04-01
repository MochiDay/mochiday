import uuid
from engine import *
from database import *


result = find_jobs("software engineer", JobSite.LEVER, TBS.PAST_WEEK, max_results=100)

print(f"Found {len(result)} jobs.")

for link in result:
    job_details = get_job_details(link)
    if job_details[0] == "Not found – 404 error" and job_details[1] == "Unknown":
        continue
    job = {}
    job["company"] = job_details[0] 
    job["job_title"] = job_details[1]
    job["image"] = job_details[2]
    job["job_url"] = link
    job["job_board"] = "Lever"
    try:
        SupabaseClient().insert_job(job)
    except Exception as e:
        print(f"Error inserting job: {e}")
        continue