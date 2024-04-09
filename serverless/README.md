# Auto Apply to Jobs

We tried to write scripts that can automatically apply to jobs for you.
However, we experienced some issues with hCaptcha when deploying to the
cloud.

This folder currently doesn't really do anything. but you may find the
core logics in `serverless/functions/src/drivers` useful.

## Help Wanted

Help us brainstorm ways to bypass hCaptcha or other CAPTCHAs. We were
thinking about making an electron app where the auto-fill scripts can be
run locally using users' residential IPs.
