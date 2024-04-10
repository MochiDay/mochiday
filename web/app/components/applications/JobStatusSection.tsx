import { JobExtended, JobStatus } from "~/types/general";
import { JobStatusRow } from "./JobStatusRow";
import { AppConfig } from "~/config/config";
import { useContext } from "react";
import { DashboardContext } from "~/routes/dashboard";

export default function JobStatusSection({
  jobs,
  status,
}: {
  jobs: JobExtended[];
  status: JobStatus;
}) {
  const dashboardContext = useContext(DashboardContext);
  return (
    <>
      {!dashboardContext.userId && (
        <div className="text-center text-lg font-bold mb-5">
          <a href="/sign-in" className="underline">
            Sign in
          </a>{" "}
          to track your job applications!
        </div>
      )}
      <h1
        className="text-2xl font-black mb-5"
        style={{
          opacity: dashboardContext.userId ? 1 : 0.5,
        }}
      >
        {AppConfig.jobStatusSectionByStatus[status].title}
      </h1>
      <div
        style={{
          display: "grid",
          opacity: dashboardContext.userId ? 1 : 0.5,
          gap: AppConfig.jobStatusSectionByStatus[status].gridGap,
          gridTemplateColumns: `repeat(${AppConfig.jobStatusSectionByStatus[status].gridCols},  minmax(0, 1fr))`,
        }}
      >
        {jobs.map((job) => (
          <JobStatusRow key={job.id} job={job} status={status} />
        ))}
      </div>
    </>
  );
}
