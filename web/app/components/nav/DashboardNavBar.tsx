import { useLocation } from "@remix-run/react";
import NavItems from "./NavItems";
import MochiDayLogo from "~/assets/img/logo.svg";

export function DashboardNavBar() {
  const location = useLocation();
  return (
    <aside
      className={`w-[15rem] 2xl:w-[18rem] h-full relative isolate py-2 pr-2 pl-1 shrink-0 overflow-y-auto`}
    >
      {/* only show top bottom and right borders */}
      <div className="h-full transform-none border-black border-4 bg-[#FFCA40] rounded-xl">
        <div className="flex items-center justify-center">
          <img src={MochiDayLogo} alt="MochiDay Logo" className="w-20" />
        </div>
        <NavItems pathname={location.pathname} />
      </div>
    </aside>
  );
}
