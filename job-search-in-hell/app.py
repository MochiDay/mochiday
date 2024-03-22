from flask import Flask, request, Response
import logging
from utils.validator import new_validator
import os
from dotenv import load_dotenv
from http import HTTPStatus

load_dotenv()

MERGENT_API_KEY = os.getenv("MERGENT_API_KEY")
PORT = os.getenv("PORT")

if PORT is None:
    PORT = 3000

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)


@app.route("/api/mergent/tasks", methods=["POST"])
def mergent_task_handler():
    try:
        validator = new_validator(MERGENT_API_KEY)
        validated, response = validator(request)

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
    # TODO: Implement this function
    logging.info(f"Performing task: {body}")


if __name__ == "__main__":
    app.run(port=PORT)
