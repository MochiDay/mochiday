import { SignedIn, UserButton, SignedOut, useUser } from "@clerk/remix";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json, NavLink, useLoaderData } from "@remix-run/react";
import { toast } from "sonner";
import { Database } from "~/types/supabase";

export const meta: MetaFunction = () => {
  return [
    { title: "MochiDay" },
    {
      name: "description",
      content: "Reclaim your life.",
    },
  ];
};

export const loader: LoaderFunction = async ({ context }) => {
  const supabase = context.supabase();
  const result = await supabase.from("jobs").select("*").limit(10);
  return json(result.data);
};

export default function Index() {
  const data = useLoaderData() as Database["public"]["Tables"]["jobs"]["Row"][];
  const { isSignedIn, user } = useUser();

  return (
    <div>
      <h1>Jobs</h1>
      <ul>
        {data.map((job) => (
          <li key={job.id}>
            <a href={job.job_url} target="_blank" rel="noreferrer">
              {job.company} - {job.job_title}
            </a>
          </li>
        ))}
      </ul>

      <SignedIn>
        <h1>Index route</h1>
        <p>You are signed in!</p>
        {isSignedIn && <p>Your email is {user.firstName}</p>}
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div>Home</div>
        <NavLink to="/sign-in">
          <button className="btn">Sign In</button>
        </NavLink>
      </SignedOut>
      <button onClick={() => toast.error("This is a sonner toast")}>
        Render my toast
      </button>
    </div>
  );
}
