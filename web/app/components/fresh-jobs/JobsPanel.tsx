import { Job, JobRowType } from "~/types/general";
import { JobRow } from "./JobRow";
import { Link } from "@remix-run/react";

export function JobsPanel({
  jobs,
  pageNumber,
  pagesRequired,
}: {
  jobs: Job[];
  pageNumber: number;
  pagesRequired: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        // two columns
        className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 px-2  pr-10 2xl:pr-0 pb-10 grid-cols-1"
        style={{ scrollbarWidth: "none" }}
      >
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} type={JobRowType.NEW_JOB} />
        ))}
      </div>
      <div className="join flex justify-center items-center pb-20">
        {pageNumber !== 1 && (
          <Link to={`/dashboard/jobs?page=${pageNumber - 1}`}>
            <button className="join-item btn bg-yellow border-yellow hover:bg-yellow hover:opacity-55 hover:border-none">
              «
            </button>
          </Link>
        )}
        <button className="join-item btn border-pink bg-pink hover:bg-pink hover:opacity-75 hover:border-none">
          Page {pageNumber}
        </button>
        {pageNumber < pagesRequired && (
          <Link to={`/dashboard/jobs?page=${pageNumber + 1}`}>
            <button className="join-item btn  bg-yellow border-yellow hover:bg-yellow hover:opacity-55 hover:border-none">
              »
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
