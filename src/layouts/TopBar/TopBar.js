import "./TopBar.css";

export default function TopBar(props) {
  const topLevelTabs = props.tabs || [];
  const onTabSelect = props.onTabSelect || function(tab) { };

  const renderTabs = (tabs) => {
    return tabs.map((tab) => (
      <button
        key={tab.key}
        className="top-bar-tab"
        onClick={() => onTabSelect(tab)}
      >
        { tab.caption }
      </button>
    ));
  };

  return (
    <div className="full top-bar">
      { renderTabs(topLevelTabs) }
    </div>
  );
}
