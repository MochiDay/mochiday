import { createContext, useContext, useRef, useState } from "react";
import { Job } from "~/types/general";

export const JobApplicationModalContext = createContext<{
  job: Job | null;
  modalId: string;
  setJob: (job: Job | null) => void;
}>({
  job: null,
  modalId: "job_application_modal",
  setJob: () => {},
});

export const JobApplicationModal = ({ id }: { id: string }) => {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { job, setJob } = useContext(JobApplicationModalContext);

  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-11/12 max-w-4xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setJob(null);
              setLoaded(false);
            }}
          >
            ✕
          </button>
        </form>
        {!loaded && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <span className="loading loading-spinner w-[7rem]"></span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Job Application"
          src={job?.job_url}
          style={{
            visibility: loaded ? "visible" : "hidden",
            width: loaded ? "100%" : "0",
            height: loaded ? "80vh" : "0",
          }}
          onLoad={(e) => {
            console.log(e.currentTarget.src);
            if (job) {
              setLoaded(true);
            }
          }}
        />
      </div>
    </dialog>
  );
};
