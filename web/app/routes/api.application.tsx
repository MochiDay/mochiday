import { ActionFunction } from "@remix-run/cloudflare";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { API_Actions } from "~/types/api";

export const action: ActionFunction = async (args) => {
  const supabase = args.context.supabase();

  const formData = await args.request.formData();

  if (!formData || !formData.get("action"))
    return jsonWithError(
      {},
      "Invalid request: no form data or action provided"
    );

  switch (formData.get("action")) {
    case API_Actions.MARK_AS_APPLIED: {
      try {
        const jobUrl = formData.get("jobUrl");
        const userId = formData.get("userId");
        if (!jobUrl || !userId)
          return jsonWithError({}, "Invalid request: missing jobUrl or userId");

        await supabase.from("applications").insert({
          job_url: jobUrl.toString(),
          user_id: userId.toString(),
          applied: true,
        });
        return jsonWithSuccess({}, "🎉 Applied to job!");
      } catch (error) {
        console.error("Error applying to job", error);
        return jsonWithError({}, "Failed to apply to job" + error);
      }
    }
    default:
      return jsonWithError({}, "Invalid action");
  }
};
