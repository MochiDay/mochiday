import { useAuth } from "@clerk/remix";
import { Outlet } from "@remix-run/react";
import { createContext } from "react";
import { DashboardNavBar } from "~/components/nav/DashboardNavBar";

export const DashboardContext = createContext({
  userId: null,
  isClerkLoaded: false,
} as {
  userId: string | null | undefined;
  isClerkLoaded: boolean;
});

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  return (
    <DashboardContext.Provider value={{ userId, isClerkLoaded: isLoaded }}>
      <div className="flex h-[100dvh] bg-base-100">
        <DashboardNavBar />
        <div className="relative isolate flex min-w-0 flex-1 flex-col py-2 pr-1">
          <div className="w-full h-full rounded-xl border-4  pr-1  border-black bg-[#FDF6E5]">
            <div className="flex flex-row w-full h-full overflow-y-auto justify-center items-center">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
