import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { JobsPanel } from "~/components/fresh-jobs/JobsPanel";
import GeneralDashboardLayout from "~/components/GeneralDashboardLayout";
import { Job, SideBarType } from "~/types/general";

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(20);
  return json(result.data);
};

export default function DashboardJobs() {
  const data = useLoaderData() as Job[];
  return (
    <GeneralDashboardLayout sidebarType={SideBarType.JOBS}>
      <JobsPanel jobs={data ?? []} />
    </GeneralDashboardLayout>
  );
}
