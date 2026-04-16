warning: in the working copy of 'frontend/gym-site/src/context/ConfigContext.jsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/frontend/gym-site/src/context/ConfigContext.jsx b/frontend/gym-site/src/context/ConfigContext.jsx[m
[1mindex 58ac53e..03e08e7 100644[m
[1m--- a/frontend/gym-site/src/context/ConfigContext.jsx[m
[1m+++ b/frontend/gym-site/src/context/ConfigContext.jsx[m
[36m@@ -6,23 +6,38 @@[m [mconst ConfigContext = createContext();[m
 export const ConfigProvider = ({ children }) => {[m
   const [config, setConfig] = useState(null);[m
 [m
[31m-  const fetchConfig = async () => {[m
[32m+[m[32m  const fetchConfig = async (isRetry = false) => {[m
     try {[m
       const res = await fetch(getApiUrl("/config"));[m
[32m+[m[41m      [m
[32m+[m[32m      const contentType = res.headers.get("content-type");[m
[32m+[m[32m      if (!contentType || !contentType.includes("application/json")) {[m
[32m+[m[32m        throw new Error("Received non-JSON response from /api/config");[m
[32m+[m[32m      }[m
[32m+[m[41m      [m
[32m+[m[32m      if (!res.ok) {[m
[32m+[m[32m        throw new Error(`HTTP error! status: ${res.status}`);[m
[32m+[m[32m      }[m
[32m+[m
       const data = await res.json();[m
       setConfig(data);[m
     } catch (err) {[m
[31m-      console.error("Config fetch error", err);[m
[31m-      setConfig({});[m
[32m+[m[32m      console.error("Config fetch error:", err.message);[m
[32m+[m[32m      if (!isRetry) {[m
[32m+[m[32m        console.warn("Retrying config fetch once after 2 seconds...");[m
[32m+[m[32m        setTimeout(() => fetchConfig(true), 2000);[m
[32m+[m[32m      } else {[m
[32m+[m[32m        setConfig({});[m
[32m+[m[32m      }[m
     }[m
   };[m
 [m
   useEffect(() => {[m
[31m-    fetchConfig();[m
[32m+[m[32m    fetchConfig(false);[m
   }, []);[m
 [m
   return ([m
[31m-    <ConfigContext.Provider value={{ config, refreshConfig: fetchConfig }}>[m
[32m+[m[32m    <ConfigContext.Provider value={{ config, refreshConfig: () => fetchConfig(false) }}>[m
       {children}[m
     </ConfigContext.Provider>[m
   );[m
