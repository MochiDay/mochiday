# Dependencies for task queue functions.
from google.cloud import tasks_v2
from firebase_functions.options import RetryConfig, RateLimits, SupportedRegion

# Dependencies for image backup.
from firebase_admin import initialize_app, functions
from firebase_functions import https_fn, tasks_fn, options
import google.auth
from google.auth.transport.requests import AuthorizedSession

# TODO: fix the credentials
app = initialize_app()

COMMON_QUEUE = "applyJob"  # The name of the queue that will be used for all tasks for free-tier users
JSON_FIELD_JOB_URLS = "job_urls"
JSON_FIELD_JOB_URL = "job_url"
JSON_FIELD_USER_ID = "user_id"

# ------------------------ Enqueue Functions ------------------------


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def enqueue_jobs(req: https_fn.Request) -> https_fn.Response:
    # try:
    try:
        # TODO: fix the json parsing
        json = req.json
        print(req.mimetype)
        job_urls = json[JSON_FIELD_JOB_URLS]
        user_id = json[JSON_FIELD_USER_ID]
        print(json)
    except KeyError:
        return https_fn.Response(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=f"Missing required fields: {JSON_FIELD_JOB_URLS} and {JSON_FIELD_USER_ID}",
        )

    common_queue = functions.task_queue(COMMON_QUEUE, app=app)
    target_uri = get_function_url(COMMON_QUEUE)
    print(app.credential.get_credential())

    for job_url in job_urls:
        body = {
            "data": {
                JSON_FIELD_JOB_URL: job_url,
                JSON_FIELD_USER_ID: user_id,
            }
        }
        task_options = functions.TaskOptions(
            # schedule_time=schedule_time,
            # dispatch_deadline_seconds=dispatch_deadline_seconds,
            uri=target_uri,
        )
        common_queue.enqueue(body, task_options)
    return https_fn.Response(status=200, response=f"Enqueued {len(job_urls)} tasks")
    # except Exception as e:
    #     print("yoyoyo")
    #     print(e)
    #     return https_fn.Response(
    #         code=https_fn.FunctionsErrorCode.INTERNAL,
    #         message="Failed to enqueue tasks",
    #     )


# ------------------------ Task Functions ------------------------


@tasks_fn.on_task_dispatched(
    retry_config=RetryConfig(max_attempts=3, min_backoff_seconds=5),
    rate_limits=RateLimits(max_concurrent_dispatches=1000),
)
def applyJob(req: tasks_fn.CallableRequest) -> https_fn.Response:
    try:
        job_url = req.data[JSON_FIELD_JOB_URL]
        user_id = req.data[JSON_FIELD_USER_ID]
    except KeyError:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=f"Missing required fields: {JSON_FIELD_JOB_URL} and {JSON_FIELD_USER_ID}",
        )
    print(f"Applying job {job_url} for user {user_id}")
    # TODO: Implement the job application logic here

    return {"status": "ok"}


# ------------------------ Helper Functions ------------------------


def get_function_url(
    name: str, location: str = SupportedRegion.US_CENTRAL1.value
) -> str:
    """Get the URL of a given v2 cloud function.

    Params:
        name: the function's name
        location: the function's location

    Returns: The URL of the function
    """
    credentials, project_id = google.auth.default(
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    authed_session = AuthorizedSession(credentials)
    url = (
        "https://cloudfunctions.googleapis.com/v2/"
        + f"projects/{project_id}/locations/{location}/functions/{name}"
    )
    response = authed_session.get(url)
    data = response.json()
    function_url = data["serviceConfig"]["uri"]
    return function_url
