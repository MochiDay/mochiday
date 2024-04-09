# Job Fetch Server

This folder contains the server that fetches job listings from various
job boards every 12 hours.

## Local Development

Start the virtual environment:

```bash
poetry shell
```

Install the dependencies:

```bash
poetry install
```

Start the server using [gunicon](https://gunicorn.org/):

```bash
gunicorn app:app
```
