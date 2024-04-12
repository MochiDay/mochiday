import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { JobExtended, JobRowType, JobStatus } from "~/types/general";
import { IconExternalLink } from "@tabler/icons-react";
import { JobRow } from "../fresh-jobs/JobRow";
import PlaceHolderImage from "~/assets/img/placeholder-image.png";

export function JobStatusRow({
  job,
  status,
}: {
  job: JobExtended;
  status: JobStatus;
}) {
  const [hovered, setHovered] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  if (status === JobStatus.ACTION_REQUIRED) {
    return <JobRow job={job} type={JobRowType.ACTION_REQUIRED} />;
  }
  // get time in hh:mma format: like 12:30p or 12:30a
  const time = new Date(job.applied_at!)
    .toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "")
    .slice(0, -1);

  // get month in MMM format
  const month = new Date(job.created_at).toLocaleString("en-US", {
    month: "short",
  });
  // get day in dd format
  const day = new Date(job.created_at).toLocaleString("en-US", {
    day: "2-digit",
  });
  // get year in yyyy format
  const year = new Date(job.created_at).toLocaleString("en-US", {
    year: "numeric",
  });

  return (
    <>
      <div
        key={job.id}
        className={`relative border-2 border-black flex flex-row justify-between items-center ${
          status === JobStatus.IN_PROGRESS
            ? "shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            : ""
        } w-full rounded-xl overflow-hidden`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex px-2 py-2 flex-row justify-start items-center w-full">
          <div
            className={`${
              status === JobStatus.APPLIED ? "filter grayscale" : ""
            } flex flex-col justify-center items-center ml-2`}
          >
            <img
              src={job.image ?? PlaceHolderImage}
              alt={job.company}
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="ml-6">
            <h2 className="font-black text-lg flex flex-row">
              {job.company}
              {hovered && (
                <Link
                  to={job.job_url.replace("/apply", "")}
                  target="_blank"
                  className="ml-1 tooltip tooltip-right font-light"
                  data-tip="Job Description"
                  rel="noreferrer"
                >
                  <IconExternalLink size={16} />
                </Link>
              )}
            </h2>
            <p className="font-semibold text-sm">{job.job_title}</p>
          </div>
        </div>

        {status === JobStatus.APPLIED && pageLoaded && (
          <div className="flex flex-row h-full font-mono">
            <div className="px-2 flex flex-col justify-center items-center h-full font-bold text-xl border-x-2 border-black">
              {time.toLocaleLowerCase()}
            </div>
            <div className="h-full flex flex-col justify-center items-center">
              <div className="text-sm flex flex-col justify-center w-full border-b-2 border-black  px-2">
                {month.toUpperCase()}
              </div>
              <div className="text-2xl flex flex-col justify-center text-center w-full h-full font-bold">
                {day}
              </div>
            </div>
            <div className="h-full flex flex-col justify-center items-center border-l-2 border-black  text-black">
              <h1
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                  inlineSize: "fit-content",
                }}
              >
                {year}
              </h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
