import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center h-[100vh]">
        <Outlet />
      </div>
      <div className="hidden md:flex flex-col justify-center h-[100vh] bg-yellow w-1/2 p-10">
        <h1 className="font-black text-black text-4xl">the game has changed</h1>
        <p className="text-black text-lg font-bold mt-10">
          chances are, your resume is not even getting read by a real human
        </p>
        <p className="text-black text-lg font-bold mt-5">
          for every new position, HR only has the capacity to look at the first
          ~200 resumes
        </p>
        <p className="text-black text-lg font-bold mt-5">
          it&apos;s a number&apos;s game AND a time game
        </p>
        <p className="text-black text-lg font-bold mt-5">
          just like you, we struggle in this job market
        </p>
        <p className="text-black text-lg font-bold mt-5">
          so we built something to help you up your chances
        </p>
      </div>
    </div>
  );
}
