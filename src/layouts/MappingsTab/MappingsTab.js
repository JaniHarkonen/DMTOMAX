import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"

const CONFIG_SUBSCRIPTION_ID = "mappings-tab";

export default function MappingsTab(props) {
  const { config } = useContext(GlobalContext);
  const [ mappings, setMappings ] = useState({ failed: true });

  useEffect(() => {
    config.subscribe(CONFIG_SUBSCRIPTION_ID, setMappings);
    return () => config.unsubscribe(CONFIG_SUBSCRIPTION_ID);
  }, []);

  return (
    <div>
      <h2>Define mappings</h2>
      <p>{JSON.stringify(mappings, null, 2)}</p>
    </div>
  )
}
