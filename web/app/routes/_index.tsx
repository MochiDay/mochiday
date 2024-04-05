import { json, LoaderFunction, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createContext, useRef, useState } from "react";
import { JobsPanel } from "~/components/fresh-jobs/JobsPanel";
import GeneralDashboardLayout from "~/components/GeneralDashboardLayout";
import { Job, SideBarType } from "~/types/general";

export const meta: MetaFunction = () => {
  return [
    { title: "MochiDay" },
    {
      name: "description",
      content: "Reclaim your life.",
    },
  ];
};

// create  modal context
export const JobApplicationModalContext = createContext<{
  job: Job | null;
  modalId: string;
  setJob: (job: Job | null) => void;
}>({
  job: null,
  modalId: "job_application_modal",
  setJob: () => {},
});

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(20);
  return json(
    result.data?.sort((a: Job, b: Job) =>
      a.created_at > b.created_at ? -1 : 1
    )
  );
};

export default function Index() {
  const data = useLoaderData() as Job[];
  const [job, setJob] = useState<Job | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <JobApplicationModalContext.Provider
      value={{ job, setJob, modalId: "job_application_modal" }}
    >
      <div className="flex h-[100dvh] bg-base-100">
        <div className="relative isolate flex min-w-0 flex-1 flex-col py-2 pr-1">
          <div className="w-full h-full rounded-xl border-4  pr-1  border-black bg-[#FDF6E5] dark:bg-[#423822]">
            <div className="flex flex-row w-full h-full overflow-y-auto justify-center items-center">
              <GeneralDashboardLayout sidebarType={SideBarType.JOBS}>
                <JobsPanel jobs={data ?? []} />
              </GeneralDashboardLayout>
            </div>
          </div>
        </div>
        <dialog id="job_application_modal" className="modal">
          <div className="modal-box w-11/12 max-w-4xl">
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
              onLoad={() => {
                if (job) {
                  setLoaded(true);
                }
              }}
            />
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn"
                  onClick={() => {
                    setJob(null);
                    setLoaded(false);
                  }}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </JobApplicationModalContext.Provider>
  );
}
