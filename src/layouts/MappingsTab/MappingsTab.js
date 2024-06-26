import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import { DEFAULT_CONFIGURATION_SCHEMA } from "../../api/configuration";
import imgWarning from "../../assets/exclamation-triangle-icon.svg";
import "./MappingsTab.css";

const CONFIG_SUBSCRIPTION_ID = "mappings-tab";

export default function MappingsTab() {
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA.mappings);
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const { config } = useContext(GlobalContext);

  useEffect(() => {
    config.subscribe(CONFIG_SUBSCRIPTION_ID, (data) => setMappings(data.configuration.mappings));
    return () => config.unsubscribe(CONFIG_SUBSCRIPTION_ID);
  }, []);

  const handleSave = () => {
    config.updateMappings(mappings);
    setUnsavedChanges({});
  };

  const handleReset = () => {
    setMappings(DEFAULT_CONFIGURATION_SCHEMA.mappings);
    setUnsavedChanges({ ...mappings });
  };

  const handleMappingChange = (mapKey, value) => {
    setMappings({
      ...mappings,
      [mapKey]: value
    });
    setUnsavedChanges({
      ...unsavedChanges,
      [mapKey]: true
    });
  };

  const renderMappings = (mappings) => {
    return Object.keys(mappings).map((mapKey) => (
      <tr key={mapKey}>
        <td>{mapKey}</td>
        <td>
          <input
            value={mappings[mapKey]}
            onChange={(e) => handleMappingChange(mapKey, e.target.value)}
          />
        </td>
        <td>
          <div className="d-flex d-align-items-center">
            {unsavedChanges[mapKey] && renderChangedWarning()}
          </div>
        </td>
      </tr>
    ));
  };

  const renderChangedWarning = () => {
    return (
      <div>
        <img
          className="warning-icon"
          src={imgWarning}
        />
        Unsaved changes!
      </div>
    )
  };

  return (
    <div>
      <div className="mappings-tab-caption">
        <h2>Define mappings</h2>
        <div className="mappings-controls-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        {Object.keys(unsavedChanges).length > 0 && renderChangedWarning()}
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Joint</th>
              <th>Replacement</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {renderMappings(mappings)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
