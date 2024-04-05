from flask import Flask, request, Response
import logging
from config.queries import COMPREHENSIVE_SOFTWARE_ENGINEER_QUERY
from utils.database import SupabaseClient
from utils.engine import TBS, JobSite, find_jobs, get_job_details
from utils.validator import new_validator
import os
from dotenv import load_dotenv
from http import HTTPStatus

load_dotenv()

MERGENT_API_KEY = os.getenv("MERGENT_API_KEY")


logging.basicConfig(level=logging.INFO)


app = Flask(__name__)


@app.route("/api/mergent/tasks", methods=["POST"])
def mergent_task_handler():
    try:
        validator = new_validator(MERGENT_API_KEY)
        validated, response = validator(request)
        validated = True
        if not validated:
            logging.error(f"Failed to validate request: {response.response}")
            return response

        perform_task(request.data.decode())
    except Exception as e:
        error_message = f"Failed to perform task: {str(e)}"
        logging.error(error_message)
        return Response(error_message, status=HTTPStatus.INTERNAL_SERVER_ERROR)

    return Response(status=HTTPStatus.OK)


def perform_task(body):
    lever_job_urls = find_jobs(
        COMPREHENSIVE_SOFTWARE_ENGINEER_QUERY, JobSite.LEVER, TBS.PAST_TWELVE_HOURS, 200
    )
    try:
        supabase_client = SupabaseClient()
        for link in lever_job_urls:
            try:
                job_details = get_job_details(link)
                if (
                    job_details[0] == "Not found – 404 error"
                    and job_details[1] == "Unknown"
                ):
                    continue
                job = {}
                job["company"] = job_details[0]
                job["job_title"] = job_details[1]
                if job_details[2] == "/img/lever-logo-full.svg":
                    job["image"] = ""
                else:
                    job["image"] = job_details[2]
                job["job_url"] = link
                job["job_board"] = "Lever"
                print("Inserting job: ", job)
                supabase_client.insert_job(job)
            except Exception as e:
                logging.error(f"Failed to process job: {str(e)}")
        supabase_client.prune_jobs()
    except Exception as e:
        logging.error(f"Failed: {str(e)}")
