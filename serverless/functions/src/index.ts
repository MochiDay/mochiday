import { HttpsError, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { onTaskDispatched } from "firebase-functions/v2/tasks";
import { GoogleAuth } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { initializeApp } from "firebase-admin/app";
import { getFunctions } from "firebase-admin/functions";
import { getJobDetails, getUserDetails } from "./database/supabase";
import { init } from "./drivers/init";
import { JobBoardDriver } from "./types/shared";
import { apply } from "./drivers/apply";

initializeApp({
  projectId: "mochiday-1",
  serviceAccountId:
    "firebase-adminsdk-sm19r@mochiday-1.iam.gserviceaccount.com",
});

const COMMON_QUEUE = "applyJobTask";
const JSON_FIELD_JOB_URLS = "job_urls";
const JSON_FIELD_JOB_URL = "job_url";
const JSON_FIELD_USER_ID = "user_id";

// ----------------------- Enqueue Functions -----------------------
export const enqueueJobsForUser = onRequest(
  { cors: true },
  async (req, res) => {
    const json = req.body;
    const userId = json[JSON_FIELD_USER_ID];
    const jobUrls = json[JSON_FIELD_JOB_URLS];
    if (!userId || !jobUrls) {
      logger.warn("Invalid payload. Must include user_id and job_urls.");
      res
        .status(400)
        .send("Invalid payload. Must include user_id and job_urls.");
      return;
    }

    const common_queue = getFunctions().taskQueue(COMMON_QUEUE);
    const uri = await getFunctionUrl(COMMON_QUEUE);

    const enqueues = [];

    for (const jobUrl of jobUrls) {
      const payload = {
        [JSON_FIELD_JOB_URL]: jobUrl,
        [JSON_FIELD_USER_ID]: userId,
      };
      enqueues.push(
        common_queue.enqueue(payload, {
          uri,
        })
      );
    }
    await Promise.all(enqueues);
    res.sendStatus(200);
  }
);
// ----------------------- Task Functions -----------------------
export const applyJobTask = onTaskDispatched(
  {
    retryConfig: {
      maxAttempts: 1,
      minBackoffSeconds: 10,
    },
    rateLimits: {
      maxConcurrentDispatches: 1000,
    },
  },
  async (req) => {
    const jobUrl = req.data[JSON_FIELD_JOB_URL];
    const userId = req.data[JSON_FIELD_USER_ID];

    if (!jobUrl || !userId) {
      logger.warn(
        `Invalid payload. Must include ${JSON_FIELD_JOB_URL} and ${JSON_FIELD_USER_ID}.`
      );
      throw new HttpsError(
        "invalid-argument",
        `Invalid payload. Must include ${JSON_FIELD_JOB_URL} and ${JSON_FIELD_USER_ID}.`
      );
    }

    logger.info(`Applying job for user ${userId} at ${jobUrl}`);
    let engine;
    try {
      const candidate = await getUserDetails(userId);
      const job = await getJobDetails(jobUrl);
      engine = await init(JobBoardDriver.LEVER, candidate, job, true, false);
      await apply(engine);
    } catch (error) {
      logger.error(`Error applying job for user ${userId} at ${jobUrl}`, error);
      throw new HttpsError("unknown", "Error applying job");
    } finally {
      await engine?.browser.close();
    }
  }
);

// ----------------------- Helper Functions -----------------------

let auth: GoogleAuth<JSONClient>;
/**
 * Get the URL of a given v2 cloud function.
 *
 * @param {string} name the function's name
 * @param {string} location the function's location
 * @return {Promise<string>} The URL of the function
 */
async function getFunctionUrl(name: string, location = "us-central1") {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
  }
  const projectId = await auth.getProjectId();
  const url =
    "https://cloudfunctions.googleapis.com/v2beta/" +
    `projects/${projectId}/locations/${location}/functions/${name}`;

  const client = await auth.getClient();
  const res: {
    data: {
      serviceConfig: {
        uri: string;
      };
    };
  } = await client.request({ url });
  const uri = res.data?.serviceConfig?.uri;
  if (!uri) {
    throw new Error(`Unable to retreive uri for function at ${url}`);
  }
  return uri;
}
