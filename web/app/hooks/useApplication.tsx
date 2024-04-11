import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { API_Actions } from "~/types/api";

export const useApplication = () => {
  const fetcher = useFetcher();
  useEffect(
    function renderToast() {
      if (fetcher.state === "idle" && fetcher.data === "Applied to job") {
        toast.success("🎉 Applied to job!");
      }
    },
    [fetcher.state, fetcher.data]
  );
  return {
    markAsApplied: (jobUrl: string, userId: string) => {
      const formData = new FormData();
      formData.append("action", API_Actions.MARK_AS_APPLIED);
      formData.append("jobUrl", jobUrl);
      formData.append("userId", userId);
      fetcher.submit(formData, {
        method: "post",
        action: "/api/application",
      });
    },
  };
};
