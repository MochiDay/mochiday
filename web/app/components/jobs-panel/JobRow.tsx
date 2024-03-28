import { Link } from "@remix-run/react";
import { useState } from "react";
import LeverPlaceHolderImage from "~/img/lever-logo-full.svg";
import { Job } from "~/types/general";
import { IconExternalLink, IconGhostFilled } from "@tabler/icons-react";

export function JobRow({ job }: { job: Job }) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div
      key={job.id}
      // translate shadow x and y
      className="relative border-2 border-black flex flex-row justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,1)] w-full rounded-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex p-2 flex-row justify-start items-center w-full">
        <div className="flex flex-col justify-center items-center ml-2 my-2">
          <img
            src={job.image ?? LeverPlaceHolderImage}
            alt={job.company}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="ml-6">
          {/* check if is less than 24 hrs ago */}
          {new Date(job.created_at).getTime() > Date.now() - 86400000 && (
            <div className="badge bg-red-500 text-white py-2 badge-sm text-xs font-bold">
              Very Fresh
            </div>
          )}

          <h2 className="font-black text-xl flex flex-row">
            {job.company}
            {hovered && (
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
          <p className="font-semibold text-lg">{job.job_title}</p>
        </div>
      </div>

      <button
        className="w-20 bg-success  hover:bg-opacity-80 flex flex-col justify-center items-center h-full tooltip tooltip-left hover:cursor-pointer active:bg-opacity-100"
        data-tip="Magic Apply"
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }}
      >
        {loading && (
          <span className="loading loading-spinner loading-md text-white" />
        )}

        {hovered && !loading && <IconGhostFilled size={40} color="white" />}
      </button>
    </div>
  );
}
