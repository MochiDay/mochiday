import { API_Actions } from "~/types/api";

export const useApplication = () => {
  return {
    markAsApplied: async (jobUrl: string, userId: string) => {
      const formData = new FormData();
      formData.append("action", API_Actions.MARK_AS_APPLIED);
      formData.append("jobUrl", jobUrl);
      formData.append("userId", userId);
      console.log("formData", formData);
      await fetch("/api/application", {
        method: "POST",
        body: formData,
      });
    },
  };
};
