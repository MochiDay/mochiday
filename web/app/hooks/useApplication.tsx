import { useFetcher } from "@remix-run/react";
import { API_Actions } from "~/types/api";

export const useApplication = () => {
  const fetcher = useFetcher();
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
