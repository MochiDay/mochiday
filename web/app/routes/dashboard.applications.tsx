import { getAuth } from "@clerk/remix/ssr.server";
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { fakeAppliedJobs } from "~/components/applications/FakeAppliedJobs";
import JobStatusBoard from "~/components/applications/JobStatusBoard";
import GeneralDashboardLayout from "~/components/GeneralDashboardLayout";
import { JobExtended, SideBarType } from "~/types/general";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return json(fakeAppliedJobs);

  const supabase = args.context.supabase();
  const userApplications = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId);
  if (!userApplications.data) return json([]);
  const appiledJobsDetails = await supabase
    .from("jobs")
    .select("*")
    .in(
      "job_url",
      userApplications.data.map((app) => app.job_url)
    );
  const response = [] as JobExtended[];
  response.push(
    ...(appiledJobsDetails.data?.map((job) => {
      return {
        ...job,
        applied: true,
        applied_at:
          userApplications.data.find((app) => app.job_url === job.job_url)
            ?.created_at ?? "",
      };
    }) ?? [])
  );

  return json(
    response.sort(
      (a, b) =>
        new Date(b.applied_at!).getTime() - new Date(a.applied_at!).getTime()
    )
  );
};

export default function DashboardApplications() {
  const appliedJobs = useLoaderData() as JobExtended[];
  return (
    <GeneralDashboardLayout sidebarType={SideBarType.APPLICATIONS}>
      <JobStatusBoard jobs={appliedJobs} />
    </GeneralDashboardLayout>
  );
}
