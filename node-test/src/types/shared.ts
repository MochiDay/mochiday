import { GhostCursor } from "ghost-cursor";
import { Browser, Page } from "puppeteer";

export interface Engine {
  page: Page;
  cursor: GhostCursor;
  browser: Browser;
  candidate: any;
  job: any;
  driver: JobBoardDriver;
  debug?: boolean;
}

export enum JobBoardDriver {
  LEVER = "lever",
  GREENHOUSE = "greenhouse",
}
