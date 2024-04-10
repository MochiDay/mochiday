import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useContext, useState } from "react";
import { JobsPanel } from "~/components/fresh-jobs/JobsPanel";
import {
  JobApplicationModal,
  JobApplicationModalContext,
} from "~/components/fresh-jobs/modals/JobApplicationModal";
import GeneralDashboardLayout from "~/components/GeneralDashboardLayout";
import { Job, JobExtended, SideBarType } from "~/types/general";
import { DashboardContext } from "./dashboard";
import { getAuth } from "@clerk/remix/ssr.server";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  const supabase = args.context.supabase();

  const pageNumberString = new URL(args.request.url).searchParams.get("page");
  const pageNumber = parseInt(pageNumberString ?? "1");

  const totalJobs = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  const pagesRequired = Math.ceil(totalJobs.count! / 20);

  const result = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .range((pageNumber - 1) * 20, pageNumber * 20 - 1);
  const jobs = result.data as Job[];
  const response = [] as JobExtended[];
  response.push(
    ...jobs.map((job) => {
      return {
        ...job,
        applied: false,
      };
    })
  );

  if (userId) {
    const appliedJobsResult = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId);
    const appliedJobs = appliedJobsResult.data;
    const appliedJobUrls = (appliedJobs ?? []).map((job) => job.job_url);
    response.forEach((job) => {
      if (appliedJobUrls.includes(job.job_url)) {
        job.applied = true;
      }
    });
  }
  return json({ pageNumber, pagesRequired, jobs: response });
};

export default function DashboardJobs() {
  const [job, setJob] = useState<Job | null>(null);
  const dashboardContext = useContext(DashboardContext);
  const { pageNumber, pagesRequired, jobs } = useLoaderData() as {
    pageNumber: number;
    pagesRequired: number;
    jobs: JobExtended[];
  };
  return (
    <JobApplicationModalContext.Provider
      value={{ job, setJob, modalId: "job_application_modal" }}
    >
      <GeneralDashboardLayout sidebarType={SideBarType.JOBS}>
        <JobsPanel
          jobs={jobs ?? []}
          pageNumber={pageNumber}
          pagesRequired={pagesRequired}
        />
      </GeneralDashboardLayout>
      <JobApplicationModal
        id="job_application_modal"
        userId={dashboardContext.userId}
      />
    </JobApplicationModalContext.Provider>
  );
}
