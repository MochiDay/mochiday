import { GhostCursor } from "ghost-cursor";
import { Browser, Page } from "puppeteer";
import { Candidate, Job } from "./supabase";

export interface Engine {
  page: Page;
  cursor: GhostCursor;
  browser: Browser;
  candidate: Candidate;
  job: Job;
  driver: JobBoardDriver;
  debug?: boolean;
}

export enum JobBoardDriver {
  LEVER = "lever",
  GREENHOUSE = "greenhouse",
}
