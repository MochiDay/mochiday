from flask import Flask, request
import logging
from utils.validator import new_validator
import os
from dotenv import load_dotenv

load_dotenv()

MERGENT_API_KEY = os.getenv("MERGENT_API_KEY")

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
        logging.error(f"Failed to perform task: {str(e)}")
        return "", 500

    return "", 200


def perform_task(body):
    # TODO: Implement this function
    logging.info(f"Performing task: {body}")


if __name__ == "__main__":
    app.run(port=3000)
