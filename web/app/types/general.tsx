import { Database } from "./supabase";

export type Job = Database["public"]["Tables"]["jobs"]["Row"];

export type NavItem = {
  name: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  link: string;
};

export type Config = {
  dashboardNavItems: NavItem[];
};
