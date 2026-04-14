import { createContext, useContext, useEffect, useState } from "react";
import { getApiUrl } from "../config/apiConfig";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const fetchConfig = async (isRetry = false) => {
    try {
      const res = await fetch(getApiUrl("/config"));
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from /api/config");
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error("Config fetch error:", err.message);
      if (!isRetry) {
        console.warn("Retrying config fetch once after 2 seconds...");
        setTimeout(() => fetchConfig(true), 2000);
      } else {
        setConfig({});
      }
    }
  };

  useEffect(() => {
    fetchConfig(false);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, refreshConfig: () => fetchConfig(false) }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
