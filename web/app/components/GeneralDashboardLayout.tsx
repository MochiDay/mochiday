import { ReactNode } from "react";
import { SideBarType } from "~/types/general";
import SideBar from "./nav/SideBar";

export default function GeneralDashboardLayout({
  children,
  sidebarType,
}: {
  children: ReactNode;
  sidebarType?: SideBarType;
}) {
  return (
    <>
      {sidebarType && <SideBar type={sidebarType} />}
      <div className="w-full h-full max-w-6xl pt-10">{children}</div>
    </>
  );
}
