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
          <div className="items-center gap-2 px-12 py-4 bg-blue-50 border-solid border-gray-900 rounded-md">
            <span className="text-md font-medium">Alerts</span>
          </div>

        </div>
    </header>
  )
}

export default TopPanel
