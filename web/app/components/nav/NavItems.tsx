import { NavLink } from "@remix-run/react";

import { AppConfig } from "~/config/config";

export default function NavItems({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col p-2 mt-10">
      <div className="w-full rounded-box font-bold">
        {AppConfig.dashboardNavItems.map((item, id) => (
          <NavLink key={item.name} to={item.link} prefetch="intent">
            <div
              key={id}
              className={`flex flex-row items-center w-full cursor-pointer my-1
              ${pathname === item.link ? "bg-black" : "hover:bg-gray-100"}
              `}
              style={{
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <div
                className={`mr-2 ${pathname === item.link ? "text-white" : ""}`}
              >
                {pathname === item.link ? item.activeIcon : item.icon}
              </div>
              <span className={`${pathname === item.link ? "text-white" : ""}`}>
                {item.name}
              </span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
