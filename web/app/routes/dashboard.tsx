import { useAuth } from "@clerk/remix";
import { Outlet } from "@remix-run/react";
import { createContext, useState } from "react";
import Room from "~/components/Room";
import { DashboardNavBar } from "~/components/nav/DashboardNavBar";
import PresenceProvider from "~/presence/presence-context";

export const DashboardContext = createContext({
  userId: null,
  isClerkLoaded: false,
  isFunMode: true,
  setIsFunMode: (isFunMode: boolean) => {},
} as {
  userId: string | null | undefined;
  isClerkLoaded: boolean;
  isFunMode: boolean;
  setIsFunMode: (isFunMode: boolean) => void;
});

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const [isFunMode, setIsFunMode] = useState(true);
  return (
    <PresenceProvider
      host="my-remix-app-party.goodluckh.partykit.dev"
      // host="localhost:1998"
      room="dashboard-page"
      presence={{
        cursor: null,
        message: null,
        name: "Anonymous User",
        color: "#0000f0",
      }}
    >
      <DashboardContext.Provider
        value={{ userId, isClerkLoaded: isLoaded, isFunMode, setIsFunMode }}
      >
        {isFunMode && <Room />}
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
    </PresenceProvider>
  );
}
