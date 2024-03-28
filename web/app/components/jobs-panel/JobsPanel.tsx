import { Job } from "~/types/general";
import { JobRow } from "./JobRow";

export function JobsPanel({ jobs }: { jobs: Job[] }) {
  return (
    <div
      // two columns
      className="grid grid-cols-2 gap-4 px-2  pr-10 2xl:pr-0"
      style={{ scrollbarWidth: "none" }}
    >
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}
