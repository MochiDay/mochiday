import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { JobsPanel } from "~/components/jobs-panel/JobsPanel";
import JobsSideBar from "~/components/jobs-panel/JobsSideBar";
import { Job } from "~/types/general";

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(30);
  return json(result.data);
};

export default function DashboardJobs() {
  const data = useLoaderData() as Job[];
  return (
    <div className="flex flex-row w-full h-full overflow-y-auto justify-center items-center">
      <JobsSideBar />
      <div className="w-full h-full max-w-6xl pt-10">
        <JobsPanel jobs={data} />
      </div>
    </div>
  );
}
