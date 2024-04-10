import {
  IconHome,
  IconHomeFilled,
  IconStack,
  IconStackFilled,
} from "@tabler/icons-react";
import { Config, JobStatus, SideBarType } from "~/types/general";

export const AppConfig: Config = {
  jobStatusSectionByStatus: {
    [JobStatus.ACTION_REQUIRED]: {
      title: "Action Required",
      gridCols: 2,
      gridGap: "1rem",
    },
    [JobStatus.IN_PROGRESS]: {
      title: "In Progress",
      gridCols: 1,
      gridGap: "0.75rem",
    },

    [JobStatus.APPLIED]: {
      title: "Applied",
      gridCols: 1,
      gridGap: "0.75rem",
    },
  },
  sideBarItemsByType: {
    [SideBarType.JOBS]: {
      title: "Fresh Jobs",
    },
    [SideBarType.APPLICATIONS]: {
      title: "Job Status",
    },
    [SideBarType.SETTINGS]: {
      title: "Settings",
    },
  },
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
    // {
    //   name: "Settings",
    //   icon: <IconSettings />,
    //   activeIcon: <IconSettingsFilled />,
    //   link: "/dashboard/settings",
    // },
  ],
};
