from utils.engine import JobSite, find_jobs, TBS

keyword = "software engineer"
job_site = JobSite.LEVER
jobs = find_jobs(keyword, job_site, tbs=TBS.PAST_DAY)
# print the jobs on each line
for job in jobs:
    print(job)
print(f"Found {len(jobs)} jobs")
