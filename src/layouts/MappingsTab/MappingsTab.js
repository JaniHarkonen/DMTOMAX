import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import { DEFAULT_CONFIGURATION_SCHEMA } from "../../api/configuration";

const CONFIG_SUBSCRIPTION_ID = "mappings-tab";

export default function MappingsTab(props) {
  const { config } = useContext(GlobalContext);
  const [ mappings, setMappings ] = useState(DEFAULT_CONFIGURATION_SCHEMA.mappings);

  useEffect(() => {
    config.subscribe(CONFIG_SUBSCRIPTION_ID, (data) => setMappings(data.configuration.mappings));
    return () => config.unsubscribe(CONFIG_SUBSCRIPTION_ID);
  }, []);

  const handleSave = () => {
    config.updateMappings(mappings);
  };

  const handleReset = () => {
    setMappings(DEFAULT_CONFIGURATION_SCHEMA.mappings);
    config.update(DEFAULT_CONFIGURATION_SCHEMA);
  };

  const renderMappings = (mappings) => {
    return Object.keys(mappings).map((mapKey) => (
      <tr key={mapKey}>
        <td>{mapKey}:</td>
        <td>
          <input
            value={mappings[mapKey]}
            onChange={(e) => setMappings({
              ...mappings,
              [mapKey]: e.target.value
            })}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h2>Define mappings</h2>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {renderMappings(mappings)}
        </tbody>
      </table>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
