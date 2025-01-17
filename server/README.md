# Job Fetch Server

This folder contains the server that fetches job listings from various
job boards every 12 hours.

## Local Development

To run the server locally, you need to have Python 3.10+ and Poetry 2.0+
installed on your machine.

First, fill in the environment variables in the `.env` file. You can copy the
`.env.example` file and fill in the values.

```bash
cp .env.example .env
```

Start the virtual environment:

```bash
poetry shell
# if you cannot run the "shell" command, please run `poetry self add poetry-plugin-shell`
```

Install the dependencies:

```bash
poetry install
```

Start the server using [gunicon](https://gunicorn.org/):

```bash
gunicorn app:app
```
