import { NavLink } from "@remix-run/react";

import { AppConfig } from "~/config/config";
import { NavItem } from "./NavItem";

export default function NavItems({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col p-2 mt-10">
      <div className="w-full rounded-box font-bold">
        {AppConfig.dashboardNavItems.map((item, id) => (
          <NavLink key={item.name} to={item.link} prefetch="intent">
            <NavItem
              name={item.name}
              isActive={pathname === item.link}
              activeIcon={item.activeIcon}
              icon={item.icon}
              key={id}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
