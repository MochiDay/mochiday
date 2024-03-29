import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import JobStatusBoard from "~/components/applications/JobStatusBoard";
import GeneralDashboardLayout from "~/components/GeneralDashboardLayout";
import { Job, SideBarType } from "~/types/general";

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(10);
  return json(result.data);
};

export default function DashboardApplications() {
  const jobs = useLoaderData() as Job[];
  return (
    <GeneralDashboardLayout sidebarType={SideBarType.APPLICATIONS}>
      <JobStatusBoard jobs={jobs ?? []} />
    </GeneralDashboardLayout>
  );
}
