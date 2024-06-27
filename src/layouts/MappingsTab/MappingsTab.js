import { useState } from "react"
import ChangedMappingWarning from "../../components/ChangedMappingWarning/ChangedMappingWarning";
import "./MappingsTab.css";
import useMappings from "../../hooks/useMappings";

const CONFIG_SUBSCRIPTION_ID = "mappings-tab";

export default function MappingsTab() {
  const [unsavedChanges, setUnsavedChanges] = useState({});

  const {
    mappings,
    saveMappings,
    resetMappings,
    editMapping
  } =  useMappings(CONFIG_SUBSCRIPTION_ID);

  const handleSave = () => {
    saveMappings();
    setUnsavedChanges({});
  };

  const handleReset = () => {
    resetMappings();
    setUnsavedChanges({ ...mappings });
  };

  const handleMappingChange = (mapKey, value) => {
    editMapping(mapKey, value);
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
            <ChangedMappingWarning hide={!unsavedChanges[mapKey]} />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="mappings-tab-caption">
        <h2>Define mappings</h2>
        <div className="mappings-controls-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <ChangedMappingWarning
          hide={Object.keys(unsavedChanges).length === 0}
        />
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
