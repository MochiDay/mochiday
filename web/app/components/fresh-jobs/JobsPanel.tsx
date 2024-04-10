import { JobExtended, JobRowType } from "~/types/general";
import { JobRow } from "./JobRow";
import { Link } from "@remix-run/react";

export function JobsPanel({
  jobs,
  pageNumber,
  pagesRequired,
}: {
  jobs: JobExtended[];
  pageNumber: number;
  pagesRequired: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        // two columns
        className="grid grid:cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-2  md:pr-10 2xl:pr-0 pb-10 grid-cols-1"
        style={{ scrollbarWidth: "none" }}
      >
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} type={JobRowType.NEW_JOB} />
        ))}
      </div>
      <div className="join flex justify-center items-center pb-20">
        {pageNumber !== 1 && (
          <Link to={`/dashboard/jobs?page=${pageNumber - 1}`} prefetch="intent">
            <button className="join-item btn bg-yellow border-yellow hover:bg-yellow hover:opacity-55">
              «
            </button>
          </Link>
        )}
        <button className="join-item btn border-pink bg-pink hover:bg-pink hover:opacity-75">
          Page {pageNumber}
        </button>
        {pageNumber < pagesRequired && (
          <Link to={`/dashboard/jobs?page=${pageNumber + 1}`} prefetch="intent">
            <button className="join-item btn bg-yellow border-yellow hover:bg-yellow hover:opacity-55">
              »
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
