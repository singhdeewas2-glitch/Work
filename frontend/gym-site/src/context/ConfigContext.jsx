import { createContext, useContext, useEffect, useState } from "react";
import { getApiUrl } from "../config/apiConfig";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch(getApiUrl("/config"));
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error("Config fetch error", err);
      setConfig({});
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, refreshConfig: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
