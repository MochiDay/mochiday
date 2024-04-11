import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/");
  const supabase = args.context.supabase();
  const user = await supabase.from("users").select("*").eq("user_id", userId);

  if (user.error) {
    return redirect("/");
  }

  if (user.data.length === 0) {
    await supabase.from("users").insert({
      user_id: userId,
    });
  }
  return redirect("/dashboard");
};

export default function AuthCallback() {
  return null;
}
