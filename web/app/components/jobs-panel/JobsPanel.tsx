import { Job } from "~/types/general";
import { JobRow } from "./JobRow";

export function JobsPanel({ jobs }: { jobs: Job[] }) {
  return (
    <div
      // two columns
      className="grid grid-cols-2 gap-4 w-full max-w-8xl mx-2"
      style={{ scrollbarWidth: "none" }}
    >
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}
