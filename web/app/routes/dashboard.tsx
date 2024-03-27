import { Outlet } from "@remix-run/react";
import { DashboardNavBar } from "~/components/nav/DashboardNavBar";

export default function Dashboard() {
  return (
    <div className="flex h-[100dvh] transition-all bg-neutral-content">
      <DashboardNavBar />
      <div className="relative isolate flex min-w-0 flex-1 flex-col py-2">
        <div className="w-full h-full rounded-xl bg-base-100 shadow-md  flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl h-full border-2 border-black">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
