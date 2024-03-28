import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { JobsPanel } from "~/components/jobs-panel/JobsPanel";
import { Job } from "~/types/general";
import WoodenLine from "~/img/wooden-line.svg";

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(30);
  return json(result.data);
};

export default function DashboardJobs() {
  const data = useLoaderData() as Job[];
  return (
    <div className="flex flex-col h-full overflow-y-auto justify-center items-center">
      <div className="flex flex-row h-full pt-10">
        {/* rotate left 90 deg */}
        <div
          className="sticky z-10 top-10 pr-10"
          style={{
            alignSelf: "flex-start",
          }}
        >
          <div className="flex flex-row justify-center items-center">
            <h1
              className="text-3xl font-black"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                inlineSize: "fit-content",
              }}
            >
              Fresh Jobs
            </h1>
            <img src={WoodenLine} alt="Wooden Line" className="-ml-4 h-50" />
          </div>
        </div>
        <div className="w-full">
          <JobsPanel jobs={data} />
        </div>
      </div>
    </div>
  );
}
