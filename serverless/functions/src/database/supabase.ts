import { createClient } from "@supabase/supabase-js";
import { Candidate, Database } from "../types/supabase";
import { config } from "dotenv";

config();
const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_KEY"];

if (!supabaseUrl || !supabaseKey)
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY");

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const getUserDetails = async (userId: string): Promise<Candidate> => {
  const userDetails = await supabase
    .from("user_details")
    .select("*")
    .eq("user_id", userId);
  if (userDetails.error) {
    console.error("Error fetching user details");
    throw new Error(userDetails.error.message);
  }

  const candidate = userDetails.data[0];
  return candidate;
};

export const getJobDetails = async (jobUrl: string) => {
  const jobDetails = await supabase
    .from("jobs")
    .select("*")
    .eq("job_url", jobUrl);
  if (jobDetails.error) {
    console.error("Error fetching job details");
    throw new Error(jobDetails.error.message);
  }

  const job = jobDetails.data[0];
  return job;
};
