import { useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { appViewContext, viewportContext } from "../Context";
import platformConfig from '../../config/platformConfig';
import stakingConfig from "config/stakingConfig";
import config from "config/config";
import arbitrageConfig,{ activeTabs as arbitrageActiveTabs } from "config/arbitrageConfig";
import { useLocation } from "react-router";

export const useViewport = () => {
  const { width, height } = useContext(viewportContext);
  return { width, height };
}

export const useIsMobile = () => {
  const { width } = useContext(viewportContext);
  return width <= 767
}

export const useIsDesktop = () => {
  const { width } = useContext(viewportContext);
  return width > 767
}

export const useIsTablet = () => {
  const { width } = useContext(viewportContext);
  return width <= 1024
}

export const useIsLaptop = () => {
  const { width } = useContext(viewportContext);
  return width <= 1365
}

export const useActiveToken = (searchInput, view, protocol) => {
  const { activeToken } = useContext(appViewContext);
  const { selectedNetwork } = useSelector(({app}) => app);
  const location = useLocation();

  if(!searchInput && activeToken) return activeToken;
  
  const pathname = view || location?.pathname;
  if(pathname === config.routes.staking.label.toLowerCase()) return stakingConfig.tokens[selectedNetwork][protocol][searchInput?.toLowerCase()];
  if(pathname === config.routes.arbitrage.path) {
    if(activeToken && arbitrageActiveTabs[searchInput]) return searchInput === arbitrageActiveTabs.mint ? activeToken.pairToken : activeToken;
    const searchedToken = arbitrageConfig.tokens[selectedNetwork][searchInput?.toLowerCase()];
    return searchedToken ? searchedToken : activeToken;
  }
  return platformConfig.tokens[selectedNetwork][searchInput?.toLowerCase()];
}

export const useInDOM = () => {
    const isMounted = useRef(false);
    useEffect(() => {
      isMounted.current = true;
      return () => isMounted.current = false;
    }, []);
    
    return useCallback(() => isMounted.current, []);
};
  

export const useOnClickOutside = (ref, handler) => {
  useEffect(
    () => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    //eslint-disable-next-line
    [ref, handler]
  );
}

export const useCopyToClipboard = text => {
  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    return success;
  };

  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!copied) setCopied(copyToClipboard(text));
    //eslint-disable-next-line
  }, [text]);
  useEffect(() => () => setCopied(false), [text]);

  return [copied, copy];
};

export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

export const useActiveVolInfo = (volKeyOrOracle = "cvi") => { // use active vol info by oracle or vol key
    const volsInfo = useSelector(({app}) => app.indexInfo);
    return volsInfo[volKeyOrOracle] || null;
}


export const useScript = (src) => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus("idle");
        return;
      }
      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelector(`script[src="${src}"]`);
      if (!script) {
        // Create script
        script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.setAttribute("data-status", "loading");
        // Add script to document body
        document.body.appendChild(script);
        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event) => {
          script.setAttribute(
            "data-status",
            event.type === "load" ? "ready" : "error"
          );
        };
        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(script.getAttribute("data-status"));
      }
      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event) => {
        setStatus(event.type === "load" ? "ready" : "error");
      };
      // Add event listeners
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);
      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
        }
      };
    },
    [src] // Only re-run effect if script src changes
  );
  return status;
}