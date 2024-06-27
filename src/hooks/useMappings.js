import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { DEFAULT_CONFIGURATION_SCHEMA, JointMapping } from "../api/configuration";

export default function useMappings(configSubscriptionId) {
  const { config } = useContext(GlobalContext);
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA.mappings);

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

  const editMapping = (index, joint, replacement) => {
    const newMappings = [ ...mappings ];
    newMappings[index] = JointMapping(joint, replacement);
    setMappings(newMappings);
  };

  return {
    mappings,
    setMappings,
    saveMappings,
    resetMappings,
    editMapping
  };
}
