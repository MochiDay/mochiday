from flask import Flask, request
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)


@app.route("/api/tasks", methods=["POST"])
def task_handler():
    body = request.data.decode()

    try:
        perform_task(body)
    except Exception as e:
        logging.error(f"Failed to perform task: {str(e)}")
        return "", 500

    return "", 200


def perform_task(body):
    # This is where you'll perform your task.
    # For now, we'll just log it.
    logging.info(f"Performing task: {body}")


if __name__ == "__main__":
    app.run(port=3000)
