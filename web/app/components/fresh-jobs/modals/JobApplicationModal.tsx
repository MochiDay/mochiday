import { useRevalidator } from "@remix-run/react";
import { createContext, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { useApplication } from "~/hooks/useApplication";
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

export const JobApplicationModal = ({
  id,
  userId,
}: {
  id: string;
  userId: string | undefined | null;
}) => {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { job, setJob } = useContext(JobApplicationModalContext);
  const { markAsApplied } = useApplication();
  const revalidator = useRevalidator();

  return (
    <dialog
      id={id}
      className="modal"
      onClose={() => {
        setJob(null);
        setLoaded(false);
      }}
    >
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
          onLoad={async () => {
            if (job && loaded) {
              setJob(null);
              setLoaded(false);
              // @ts-expect-error Property 'showModal' does not exist on type 'HTMLElement'
              document.getElementById(id).close();
              if (!userId) {
                toast.success("🎉 Applied to job!");
                toast.info("Sign in to save your progress!", {
                  duration: 5000,
                  closeButton: true,
                });
              } else {
                await markAsApplied(job.job_url, userId);
                revalidator.revalidate();
              }
              return;
            }
            if (job) {
              setLoaded(true);
            }
          }}
        />
      </div>
    </dialog>
  );
};
