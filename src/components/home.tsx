import React from "react";
import MetricsGrid from "./dashboard/MetricsGrid";
import MainContent from "./dashboard/MainContent";
import { useMetrics } from "@/lib/hooks/useMetrics";

const Home = () => {
  const { metrics, loading } = useMetrics();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-none">
        <MetricsGrid metrics={metrics} />
      </div>
      <div className="flex-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
