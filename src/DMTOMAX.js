import TopBar from "./layouts/TopBar/TopBar";
import { DMTOMAXTabs } from "./model/appTabs";
import { useState } from "react";
import "./DMTOMAX.css";

export default function DMTOMAX() {
  const [selectedTab, setTab] = useState(null);

  return (
    <div className="app-content">
      <TopBar
        tabs={DMTOMAXTabs}
        onTabSelect={(tab) => setTab(tab)}
      />
      <div className="overflow-y-auto">
        {selectedTab && <selectedTab.TabElement />}
      </div>
    </div>
  );
}
