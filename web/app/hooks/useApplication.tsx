import { toast } from "sonner";
import { API_Actions } from "~/types/api";

export const useApplication = () => {
  return {
    markAsApplied: async (jobUrl: string, userId: string) => {
      const formData = new FormData();
      formData.append("action", API_Actions.MARK_AS_APPLIED);
      formData.append("jobUrl", jobUrl);
      formData.append("userId", userId);

      const response = await fetch("/api/application", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast.success("🎉 Applied to job!");
      }
      return response;
    },
  };
};
