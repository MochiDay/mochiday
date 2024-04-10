import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import { redirectWithError, redirectWithSuccess } from "remix-toast";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/");
  const supabase = args.context.supabase();
  const user = await supabase.from("users").select("*").eq("user_id", userId);

  if (user.error) {
    return redirectWithError("/", "Failed to fetch user data");
  }

  if (user.data.length === 0) {
    await supabase.from("users").insert({
      user_id: userId,
    });
  }
  return redirectWithSuccess("/dashboard", "Logged in successfully");
};

export default function AuthCallback() {
  return null;
}
