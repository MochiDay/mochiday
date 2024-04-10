import { Link, useLocation } from "@remix-run/react";
import NavItems from "./NavItems";
import MochiDayLogo from "~/assets/img/logo.svg";
import NextBatchCountdown from "../NextBatchCountdown";
import { useContext } from "react";
import { DashboardContext } from "~/routes/dashboard";
import { UserButton } from "@clerk/remix";

export function DashboardNavBar() {
  const location = useLocation();
  const dashboardContext = useContext(DashboardContext);
  return (
    <aside
      className={`hidden md:block w-[15rem] 2xl:w-[18rem] h-full relative isolate py-2 pr-2 pl-1 shrink-0 overflow-y-auto`}
    >
      <div className="h-full transform-none border-black border-4 bg-[#FFCA40] rounded-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center">
            <img src={MochiDayLogo} alt="MochiDay Logo" className="w-20" />
          </div>
          <NextBatchCountdown />

          <NavItems pathname={location.pathname} />
        </div>
        {!dashboardContext.userId ? (
          <Link
            to="/sign-in"
            className="btn skeleton bg-primary btn-primary m-2"
          >
            <button>Sign In</button>
          </Link>
        ) : (
          <div className="flex flex-row w-full justify-center mb-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
    </aside>
  );
}
