import { Database } from "./supabase";

export type Job = Database["public"]["Tables"]["jobs"]["Row"];

export type NavItem = {
  name: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  link: string;
};

export type Config = {
  jobStatusSectionByStatus: Record<
    JobStatus,
    { title: string; gridCols: number; gridGap: string }
  >;
  sideBarItemsByType: Record<SideBarType, { title: string }>;
  dashboardNavItems: NavItem[];
};

export enum SideBarType {
  JOBS = "jobs",
  APPLICATIONS = "applications",
  SETTINGS = "settings",
}

export enum JobStatus {
  IN_PROGRESS = "in_progress",
  APPLIED = "applied",
  ACTION_REQUIRED = "action_required",
}

export enum JobRowType {
  NEW_JOB = "new_job",
  ACTION_REQUIRED = "action_required",
}

export type JobExtended = Job & {
  applied: boolean;
  applied_at?: string;
};
