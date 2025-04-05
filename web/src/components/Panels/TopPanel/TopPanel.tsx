import { Link, routes } from "@redwoodjs/router";
import React, { useEffect, useState } from "react";

const TopPanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [currentTime, setCurre]
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-20 justify-end">

          <div className="items-center gap-2">
            <div className="text-xs text-gray-600">
              DATE
            </div>
            <div className="text-md font-semibold">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="items-center gap-2">
            <div className="text-xs text-gray-600">
              TIME
            </div>
            <div className="text-md font-semibold">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>

          <div className="items-center gap-2">
            <div className="text-xs text-gray-600">
                TEMP
              </div>
              <div className="text-md font-semibold">
                75°F
              </div>
          </div>

          <div className="items-center gap-2">
            <div className="text-xs text-gray-600">
                MOON PHASE
              </div>
              <div className="text-md font-semibold">
                Hoku
              </div>
          </div>

          {/* TODO make into button */}
          <div className="items-center gap-2 px-12 py-4">
              <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Link to={routes.alerts()}>
                  Alerts
                </Link>
              </button>
          </div>

        </div>
    </header>
  )
}

export default TopPanel
