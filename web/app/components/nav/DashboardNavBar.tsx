import { useLocation } from "@remix-run/react";
import NavItems from "./NavItem";

export function DashboardNavBar() {
  const location = useLocation();
  return (
    <aside
      className={`w-60 h-full relative isolate shrink-0 overflow-y-auto transition-all`}
    >
      <div className="h-full transform-none">
        <NavItems pathname={location.pathname} />
      </div>
    </aside>
  );
}
