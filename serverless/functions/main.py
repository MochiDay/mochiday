# Deploy with `firebase deploy`
from firebase_functions import https_fn, options
from firebase_admin import initialize_app

initialize_app()


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def apply_job(req: https_fn.Request) -> https_fn.Response:
    # TODO: Implement this function
    print(req.json)

    return https_fn.Response("yi", status=200)
