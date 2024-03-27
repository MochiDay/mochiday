import { Link } from "@remix-run/react";
import { useState } from "react";
import { toast } from "sonner";
import LeverPlaceHolderImage from "~/img/lever-logo-full.svg";
import { Job } from "~/types/general";

export function JobRow({ job }: { job: Job }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      key={job.id}
      className="border-2 border-black flex flex-row justify-between items-center p-2"
      style={{
        transition: "all 0.2s",
        backgroundColor: hovered ? "rgba(0, 0, 0, 0.1)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-row justify-start items-center w-full">
        <div className="flex flex-col justify-center items-center ml-2 my-2">
          <img
            src={job.image ?? LeverPlaceHolderImage}
            alt={job.company}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="ml-6">
          <h2 className="font-black text-xl">{job.company}</h2>
          <p className="font-semibold text-lg">{job.job_title}</p>
        </div>
      </div>

      <div
        className={`${
          hovered ? "display" : "hidden"
        } flex flex-row justify-end items-center`}
        style={{
          transition: "all 0.2s",
        }}
      >
        <Link
          to={job.job_url.replace(/\/apply$/, "")}
          target="_blank"
          rel="noreferrer"
        >
          <button
            className="btn btn-neutral mx-1"
            onClick={() => toast.info("Opened job in new tab")}
          >
            Details
          </button>
        </Link>
        <button className="btn btn-primary mr-5">Auto Apply</button>
      </div>
    </div>
  );
}
