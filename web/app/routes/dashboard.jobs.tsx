import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { JobsPanel } from "~/components/jobs-panel/JobsPanel";
import { Job } from "~/types/general";

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(30);
  return json(result.data);
};

export default function DashboardJobs() {
  const data = useLoaderData() as Job[];
  return <JobsPanel jobs={data} />;
}
