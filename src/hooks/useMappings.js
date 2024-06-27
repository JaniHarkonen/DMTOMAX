import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { DEFAULT_CONFIGURATION_SCHEMA } from "../api/configuration";

export default function useMappings(configSubscriptionId) {
  const { config } = useContext(GlobalContext);
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA);

  useEffect(() => {
    config.subscribe(configSubscriptionId, (data) => setMappings(data.configuration.mappings));
    return () => config.unsubscribe(configSubscriptionId);
  }, [config]);

  const saveMappings = () => {
    config.updateMappings(mappings);
  };

  const resetMappings = () => {
    setMappings(DEFAULT_CONFIGURATION_SCHEMA.mappings);
  };

  const editMapping = (mapKey, value) => {
    setMappings({
      ...mappings,
      [mapKey]: value
    });
  }

  return {
    mappings,
    setMappings,
    saveMappings,
    resetMappings,
    editMapping
  };
}
