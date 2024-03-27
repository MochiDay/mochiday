import { Job } from "~/types/general";
import { JobRow } from "./JobRow";

export function JobsPanel({ jobs }: { jobs: Job[] }) {
  return (
    <div
      className="overflow-y-auto relative h-full"
      style={{ scrollbarWidth: "none" }}
    >
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}
