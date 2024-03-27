import { NavLink } from "@remix-run/react";
import { AppConfig } from "~/config/config";

export default function NavItems({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col p-4 h-full">
      <ul className="menu bg-base-200 w-full rounded-box">
        {AppConfig.dashboardNavItems.map((item, id) => (
          <li key={id}>
            <NavLink key={item.name} to={item.link}>
              <span className="mr-2">
                {pathname === item.link ? item.activeIcon : item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
