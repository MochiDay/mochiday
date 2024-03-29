import { Job, JobRowType } from "~/types/general";
import { JobRow } from "./JobRow";

export function JobsPanel({ jobs }: { jobs: Job[] }) {
  return (
    <div
      // two columns
      className="grid grid-cols-2 gap-4 px-2  pr-10 2xl:pr-0 pb-20"
      style={{ scrollbarWidth: "none" }}
    >
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} type={JobRowType.NEW_JOB} />
      ))}
    </div>
  );
}
