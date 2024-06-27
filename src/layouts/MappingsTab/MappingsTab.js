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
  } = useMappings(CONFIG_SUBSCRIPTION_ID);

  const handleSave = () => {
    saveMappings();
    setUnsavedChanges({});
  };

  const handleReset = () => {
    resetMappings();
    
    const changes = {};
    for( let i = 0; i < mappings.length; i++ )
    changes[i] = false;

    setUnsavedChanges(changes);
  };

  const handleMappingEdit = (index, joint, replacement) => {
    editMapping(index, joint, replacement);
    setUnsavedChanges({
      ...unsavedChanges,
      [index]: true
    });
  };

  const renderMappings = (mappings) => {
    return mappings.map((mapping, index) => {
      return (
        <tr key={"mapping-" + index}>
          <td>
            <input
              value={mapping.joint}
              onChange={(e) => handleMappingEdit(index, e.target.value, mapping.replacement)}
            />
          </td>
          <td>
            <input
              value={mapping.replacement}
              onChange={(e) => handleMappingEdit(index, mapping.joint, e.target.value)}
            />
          </td>
          <td>
            <div className="d-flex d-align-items-center">
              <ChangedMappingWarning hide={!unsavedChanges[index]} />
            </div>
          </td>
        </tr>
      )
    });
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
