import {
  IconHome,
  IconHomeFilled,
  IconStack,
  IconSettings,
  IconSettingsFilled,
  IconStackFilled,
} from "@tabler/icons-react";
import { Config } from "~/types/general";

export const AppConfig: Config = {
  dashboardNavItems: [
    {
      name: "Dashboard",
      icon: <IconHome />,
      activeIcon: <IconHomeFilled />,
      link: "/dashboard/jobs",
    },

    {
      name: "Applications",
      icon: <IconStack />,
      activeIcon: <IconStackFilled />,
      link: "/dashboard/applications",
    },
    {
      name: "Settings",
      icon: <IconSettings />,
      activeIcon: <IconSettingsFilled />,
      link: "/dashboard/settings",
    },
  ],
};
