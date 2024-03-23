import uuid
from engine import *
from database import *


result = find_jobs("software engineer", JobSite.LEVER, TBS.PAST_YEAR, max_results=300)

print(f"Found {len(result)} jobs.")

for link in result:
    job_details = get_job_details(link)
    if job["company"] == "Not found – 404 error" and job["job_title"] == "Unknown":
        continue
    job = {}
    job["company"] = job_details[0] 
    job["job_title"] = job_details[1]
    job["image"] = job_details[2]
    job["job_url"] = link
    SupabaseClient().insert_job(job)