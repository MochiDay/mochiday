import { useLocation } from "@remix-run/react";
import NavItems from "./NavItems";
import MochiDayLogo from "~/assets/img/logo.svg";
import { useEffect, useState } from "react";
function getNextFetchDate() {
  // make sure it's UTC
  const now = Date.now();
  const nextNoon = new Date();
  nextNoon.setHours(12, 0, 0, 0);
  const nextMidnight = new Date();
  nextMidnight.setHours(0, 0, 0, 0);
  if (now < nextNoon.getTime() && now < nextMidnight.getTime()) {
    return nextNoon;
  } else {
    return nextMidnight;
  }
}
export function DashboardNavBar() {
  const location = useLocation();
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0)
      setNextUpdate(getNextFetchDate());
  }, [hours, minutes, seconds]);
  useEffect(() => {
    if (nextUpdate) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = new Date(nextUpdate.getTime() - now.getTime());
        const hours = diff.getHours();
        const minutes = diff.getMinutes();
        const seconds = diff.getSeconds();
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nextUpdate]);
  return (
    <aside
      className={`hidden md:block w-[15rem] 2xl:w-[18rem] h-full relative isolate py-2 pr-2 pl-1 shrink-0 overflow-y-auto`}
    >
      {/* only show top bottom and right borders */}
      <div className="h-full transform-none border-black border-4 bg-[#FFCA40] rounded-xl">
        <div className="flex items-center justify-center">
          <img src={MochiDayLogo} alt="MochiDay Logo" className="w-20" />
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <div>
            <h1 className="text-sm font-bold">Next Batch In:</h1>
          </div>
          <span className="countdown font-mono text-2xl">
            {/* @ts-expect-error no --value */}
            <span style={{ "--value": hours }}></span>:
            {/* @ts-expect-error no --value */}
            <span style={{ "--value": minutes }}></span>:
            {/* @ts-expect-error no --value */}
            <span style={{ "--value": seconds }}></span>
          </span>
        </div>
        <NavItems pathname={location.pathname} />
      </div>
    </aside>
  );
}
