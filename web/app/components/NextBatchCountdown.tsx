import React, { useEffect, useState } from "react";
function getNextFetchDate() {
  const currentTime = new Date(Date.now());
  const currentHour = currentTime.getUTCHours();

  const nextNoon = new Date(currentTime);
  nextNoon.setUTCHours(12, 0, 0, 0); // Set to next noon

  const nextMidnight = new Date(currentTime);
  nextMidnight.setUTCHours(24, 0, 0, 0); // Set to next midnight

  // Check if it's already past noon today
  if (currentHour >= 12) {
    nextNoon.setUTCDate(nextNoon.getUTCDate() + 1); // Move to next day
  }

  // Check if it's already past midnight today
  if (currentHour >= 24) {
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1); // Move to next day
  }

  // Calculate time differences
  const noonDifference = Math.abs(nextNoon.getTime() - currentTime.getTime());
  const midnightDifference = Math.abs(
    nextMidnight.getTime() - currentTime.getTime()
  );

  // Return the closest time
  return noonDifference < midnightDifference ? nextNoon : nextMidnight;
}
function NextBatchCountdown() {
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0)
      setNextUpdate(getNextFetchDate());
  }, [hours, minutes, seconds]);

  const updateCountdown = () => {
    if (nextUpdate) {
      const now = new Date();
      const diff = new Date(nextUpdate.getTime() - now.getTime());
      const diffHours = diff.getUTCHours();
      const diffMinutes = diff.getUTCMinutes();
      const diffSeconds = diff.getUTCSeconds();
      setHours(diffHours);
      setMinutes(diffMinutes);
      setSeconds(diffSeconds);
    }
  };

  useEffect(() => {
    if (nextUpdate) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [nextUpdate]);
  return (
    <div
      className="flex flex-col justify-center items-center mt-10 tooltip before:text-xs before:max-w-[8rem] before:content-[attr(data-tip)]"
      data-tip="Takes ~10mins to process once hits 0"
    >
      <div>
        <h1 className="text-sm font-bold">Next Update In:</h1>
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
  );
}

// memoize the component
export default React.memo(NextBatchCountdown);
