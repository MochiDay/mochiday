import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { JobsPanel } from "~/components/fresh-jobs/JobsPanel";
import {
  JobApplicationModal,
  JobApplicationModalContext,
} from "~/components/fresh-jobs/modals/JobApplicationModal";
import GeneralDashboardLayout from "~/components/GeneralDashboardLayout";
import { Job, SideBarType } from "~/types/general";

export const loader: LoaderFunction = async ({ context, request }) => {
  const supabase = context.supabase();

  const pageNumberString = new URL(request.url).searchParams.get("page");
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

  return json({ pageNumber, pagesRequired, jobs: result.data });
};

export default function DashboardJobs() {
  const [job, setJob] = useState<Job | null>(null);
  const { pageNumber, pagesRequired, jobs } = useLoaderData() as {
    pageNumber: number;
    pagesRequired: number;
    jobs: Job[];
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
      <JobApplicationModal id="job_application_modal" />
    </JobApplicationModalContext.Provider>
  );
}
