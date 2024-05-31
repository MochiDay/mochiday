import { Link, useLocation } from "@remix-run/react";
import NavItems from "./NavItems";
import MochiDayLogo from "~/assets/img/logo.svg";
import NextBatchCountdown from "../NextBatchCountdown";
import { useContext } from "react";
import { DashboardContext } from "~/routes/dashboard";
import { UserButton } from "@clerk/remix";
import { IconConfetti, IconConfettiOff } from "@tabler/icons-react";
import { NavItem } from "./NavItem";
import { PartyModeExplainerModal } from "../fresh-jobs/modals/PartyModeExplainerModal";

export function DashboardNavBar() {
  const location = useLocation();
  const dashboardContext = useContext(DashboardContext);

  return (
    <aside
      className={`hidden md:block w-[15rem] 2xl:w-[18rem] h-full relative isolate py-2 pr-2 pl-1 shrink-0 overflow-y-auto`}
    >
      <div className="h-full transform-none border-black border-4 bg-[#FFCA40] rounded-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center">
            <img src={MochiDayLogo} alt="MochiDay Logo" className="w-20" />
          </div>
          <NextBatchCountdown />

          <NavItems pathname={location.pathname} />

          <div>
            <div
              className="font-bold px-2"
              onClick={() =>
                dashboardContext.setIsFunMode(!dashboardContext.isFunMode)
              }
            >
              <NavItem
                name="Party Mode"
                isActive={dashboardContext.isFunMode}
                activeIcon={<IconConfetti />}
                icon={<IconConfettiOff />}
                activeBgColor="bg-red"
              />
            </div>
          </div>
          <div
            className="text-center text-xs text-black/50 hover:cursor-pointer"
            onClick={() => {
              // @ts-ignore
              document.getElementById("fun-mode").showModal();
            }}
          >
            What is this?
          </div>
          <PartyModeExplainerModal modelId="fun-mode" />
        </div>

        <>
          {!dashboardContext.userId ? (
            <Link
              to="/sign-in"
              className="btn skeleton bg-primary btn-primary m-2"
            >
              <button>Sign In</button>
            </Link>
          ) : (
            <div className="flex flex-row w-full justify-center mb-2 border-t-2 border-opacity-20 pt-2">
              <UserButton
                afterSignOutUrl="/"
                showName={true}
                appearance={{
                  elements: {
                    userButtonBox: {
                      flexDirection: "row-reverse",
                    },
                    userButtonOuterIdentifier: {
                      paddingLeft: "0rem",
                    },
                  },
                }}
              />
            </div>
          )}
        </>
      </div>
    </aside>
  );
}
