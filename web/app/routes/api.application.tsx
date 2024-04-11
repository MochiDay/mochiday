import { ActionFunction } from "@remix-run/cloudflare";
import { jsonWithError } from "remix-toast";
import { API_Actions } from "~/types/api";

export const action: ActionFunction = async (args) => {
  const supabase = args.context.supabase();

  const formData = await args.request.formData();

  if (!formData || !formData.get("action"))
    return new Response("Invalid request", { status: 400 });

  switch (formData.get("action")) {
    case API_Actions.MARK_AS_APPLIED: {
      try {
        const jobUrl = formData.get("jobUrl");
        const userId = formData.get("userId");
        if (!jobUrl || !userId)
          return new Response("Invalid request: need jobURL and userId", {
            status: 400,
          });

        const result = await supabase.from("applications").upsert({
          job_url: jobUrl.toString(),
          user_id: userId.toString(),
          applied: true,
        });
        if (result.error) {
          console.error("Error applying to job", result.error);
          return jsonWithError(
            {},
            "Error applying to job" + result.error.message
          );
        }
        return new Response("Applied to job", { status: 200 });
      } catch (error) {
        console.error("Error applying to job", error);
        return new Response("Error applying to job", { status: 500 });
      }
    }
    default:
      return new Response("Invalid request", { status: 400 });
  }
};
