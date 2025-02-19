import React from "react";
import ActivitiesFeed from "./ActivitiesFeed";
import QuickActions from "./QuickActions";

interface MainContentProps {
  activitiesFeedWidth?: string;
  quickActionsWidth?: string;
}

const MainContent = ({
  activitiesFeedWidth = "w-2/3",
  quickActionsWidth = "w-1/3",
}: MainContentProps) => {
  return (
    <div className="flex gap-6 h-[700px] w-full bg-gray-50 p-6">
      <div className={`${activitiesFeedWidth}`}>
        <ActivitiesFeed />
      </div>
      <div className={`${quickActionsWidth}`}>
        <QuickActions />
      </div>
    </div>
  );
};

export default MainContent;
