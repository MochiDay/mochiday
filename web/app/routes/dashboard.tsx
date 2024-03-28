import { Outlet } from "@remix-run/react";
import { DashboardNavBar } from "~/components/nav/DashboardNavBar";

export default function Dashboard() {
  return (
    <div className="flex h-[100dvh] bg-base-100">
      <DashboardNavBar />
      <div className="relative isolate flex min-w-0 flex-1 flex-col py-2 pr-1">
        <div className="w-full h-full rounded-xl border-4 border-black  flex flex-col justify-center items-center bg-[#FDF6E5]">
          <div className="w-full h-full pr-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
