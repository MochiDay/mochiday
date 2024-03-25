import hashlib
import hmac
import base64
from flask import Request, Response
from http import HTTPStatus


def new_validator(api_key: str | None):

    def validate_request(request: Request) -> tuple[bool, Response]:
        validated = True
        response = Response(status=HTTPStatus.OK)

        if api_key is None:
            validated = False
            response.response = "API key not set."
            response.status = HTTPStatus.INTERNAL_SERVER_ERROR
            return validated, response

        body = request.data.decode()
        signature = request.headers.get("X-Mergent-Signature")

        if not _validate_signature(body, signature):
            validated = False
            response.response = "Invalid signature."
            response.status = HTTPStatus.UNAUTHORIZED

        return validated, response

    def _build_signature(body):
        data = body or ""
        return hmac.new(
            key=api_key.encode("utf-8"),
            msg=data.encode("utf-8"),
            digestmod=hashlib.sha1,
        ).digest()

    def _validate_signature(body, signature: str | None):
        if not signature:
            return False
        merged_signature = base64.b64encode(_build_signature(body)).decode()
        return signature == merged_signature

    return validate_request
