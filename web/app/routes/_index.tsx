import { SignedIn, UserButton, SignedOut, useUser } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/cloudflare";
import { NavLink } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "MochiDay" },
    {
      name: "description",
      content: "Reclaim your life.",
    },
  ];
};

export default function Index() {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      <SignedIn>
        <h1>Index route</h1>
        <p>You are signed in!</p>
        {isSignedIn && <p>Your email is {user.firstName}</p>}
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div>Home</div>
        <NavLink to="/sign-in">Sign In</NavLink>
      </SignedOut>
    </div>
  );
}
