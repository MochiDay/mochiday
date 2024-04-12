import { Link } from "@remix-run/react";
import { useContext, useState } from "react";
import { JobExtended, JobRowType } from "~/types/general";
import {
  IconExternalLink,
  IconGhostFilled,
  IconChecks,
} from "@tabler/icons-react";
import { JobApplicationModalContext } from "./modals/JobApplicationModal";
import { toast } from "sonner";
import Greenhouse from "~/assets/img/greenhouse-badge.svg";
import Lever from "~/assets/img/lever-badge.svg";
import PlaceHolderImage from "~/assets/img/placeholder-image.png";
import Ashby from "~/assets/img/ashby-badge.svg";

export function JobRow({ job, type }: { job: JobExtended; type: JobRowType }) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setJob, modalId } = useContext(JobApplicationModalContext);

  return (
    <>
      <div
        key={job.id}
        // translate shadow x and y
        className="relative border-2 border-black flex flex-row justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,1)] w-full rounded-xl overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex p-2 flex-row justify-start items-center w-full">
          <div className="flex flex-col justify-center items-center ml-2">
            <img
              src={job.image ?? PlaceHolderImage}
              alt={job.company}
              className="w-10 h-10 md:w-16 md:h-16 object-contain"
            />
          </div>
          <div className="ml-6">
            <div className="job-board-logo">
              {job.job_board && (
                <img
                  src={
                    job.job_board === "GREENHOUSE"
                      ? Greenhouse
                      : job.job_board === "LEVER"
                      ? Lever
                      : Ashby
                  }
                  alt={job.job_board}
                  className="w-13 h-4 mr-0.5"
                  style={{ display: "inline-block" }}
                />
              )}

              {/* check if the job is fresh i.e. created within the last 24 hours */}
              {new Date(job.created_at).getTime() > Date.now() - 86400000 && (
                <div className="badge  bg-red text-white py-2 badge-sm text-xs font-bold">
                  Very Fresh
                </div>
              )}
            </div>
            <h2 className="font-black text-lg flex flex-row">
              {job.company}
              {hovered && type === JobRowType.NEW_JOB && (
                <Link
                  // remove the /apply from the job url
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

        <div className="flex flex-row  h-full">
          {type === JobRowType.ACTION_REQUIRED && (
            <button
              className={`w-20 bg-black hover:bg-opacity-80 flex flex-col justify-center items-center h-full tooltip tooltip-left hover:cursor-pointer active:bg-opacity-100`}
              data-tip={"Mark as Done"}
              style={{
                visibility: hovered || loading ? "visible" : "hidden",
              }}
              onClick={() => {
                if (!loading) {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                  }, 2000);
                }
              }}
            >
              {loading && (
                <span className="loading loading-spinner loading-md text-white" />
              )}

              {!loading && <IconChecks size={40} color="white" />}
            </button>
          )}
          <button
            className={`w-20 ${
              type === JobRowType.ACTION_REQUIRED || job.applied
                ? "bg-warning"
                : "bg-success"
            }  hover:bg-opacity-80 flex flex-col justify-center items-center h-full tooltip tooltip-left hover:cursor-pointer active:bg-opacity-100`}
            data-tip={
              job.applied
                ? "Applied!"
                : type === JobRowType.NEW_JOB
                ? "Apply"
                : "Manually Apply"
            }
            onClick={async () => {
              if (job.applied) {
                toast.info("Already applied to this job!", { duration: 1000 });
                return;
              }
              // @ts-expect-error Property 'showModal' does not exist on type 'HTMLElement'
              document.getElementById(modalId).showModal();
              await new Promise((resolve) => setTimeout(resolve, 200));
              setJob(job);
            }}
          >
            {loading && type === JobRowType.NEW_JOB && (
              <span className="loading loading-spinner loading-md text-white" />
            )}

            {!loading && type === JobRowType.NEW_JOB && !job.applied && (
              <IconGhostFilled
                size={40}
                color="white"
                className="block md:hidden"
              />
            )}

            {job.applied && <IconChecks size={40} color="white" />}

            {hovered &&
              !loading &&
              type === JobRowType.NEW_JOB &&
              !job.applied && (
                <IconGhostFilled
                  size={40}
                  color="white"
                  className="hidden md:block"
                />
              )}
            {hovered && type === JobRowType.ACTION_REQUIRED && (
              <Link to={job.job_url} target="_blank" rel="noreferrer">
                <IconExternalLink size={40} color="white" />
              </Link>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
