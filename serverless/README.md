
# Local Development

## Firebase Setup

You need to make sure you have firebase-tools installed:

```bash
npm install -g firebase-tools
```

To test serverless functions, run the emulator:

```bash
firebase emulators:start
```

Read the [Get Started](https://firebase.google.com/docs/functions/get-started) guide to learn more about Firebase Functions.

## Python Setup

Make sure you activate the virtual environment before running the following commands:

```bash
source functions/venv/bin/activate
```

Run the following the install Python dependencies:

```bash
pip install -r requirements.txt
```

Deactivate the virtual environment when you're done:

```bash
deactivate
```
