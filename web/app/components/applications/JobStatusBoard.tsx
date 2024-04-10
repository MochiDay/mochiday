import { JobExtended, JobStatus } from "~/types/general";
import JobStatusSection from "./JobStatusSection";

export default function JobStatusBoard({ jobs }: { jobs: JobExtended[] }) {
  return (
    <div className="px-2 pr-10 2xl:pr-0 pb-20">
      {/* Action Required */}
      {/* <div>
        <JobStatusSection jobs={jobs} status={JobStatus.ACTION_REQUIRED} />
      </div> */}

      {/* In Progress */}
      {/* <div className="mt-10">
        <JobStatusSection jobs={jobs} status={JobStatus.IN_PROGRESS} />
      </div> */}

      {/* Applied */}
      <div className="">
        {<JobStatusSection jobs={jobs} status={JobStatus.APPLIED} />}
      </div>
    </div>
  );
}
