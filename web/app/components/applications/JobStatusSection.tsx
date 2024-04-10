import { JobExtended, JobStatus } from "~/types/general";
import { JobStatusRow } from "./JobStatusRow";
import { AppConfig } from "~/config/config";

export default function JobStatusSection({
  jobs,
  status,
}: {
  jobs: JobExtended[];
  status: JobStatus;
}) {
  return (
    <>
      <h1 className="text-2xl font-black mb-5">
        {AppConfig.jobStatusSectionByStatus[status].title}
      </h1>
      <div
        style={{
          display: "grid",
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
