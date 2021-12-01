import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { appViewContext, viewportContext } from "../Context";
import platformConfig from '../../config/platformConfig';
import stakingConfig from "config/stakingConfig";
import { chainNames } from '../../connectors';
import config from "config/config";
import arbitrageConfig,{ activeTabs as arbitrageActiveTabs } from "config/arbitrageConfig";
import { useLocation } from "react-router";
import { useActiveWeb3React } from "./wallet";
import { DAY } from "./useEvents";
import { getW3 } from '@coti-io/cvi-sdk';
import debounce from "lodash.debounce";

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
  if(pathname === "staking") return stakingConfig.tokens[selectedNetwork][protocol][searchInput?.toLowerCase()];
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

export const useW3SDK = (w3filters) => {
  const [w3, setW3] = useState();
  const { library: web3 } = useActiveWeb3React();
  const { selectedNetwork } = useSelector(({app}) => app);
  const [filters, setFilters] = useState(w3filters);

  const getW3Instance = useCallback(async (provider) => {
    try {
      let w3Inst = await getW3(selectedNetwork === chainNames.Matic ? 'Polygon' : 'Ethereum', {
        provider, 
        env: process.env.REACT_APP_ENVIRONMENT === "mainnet" ? "live" : process.env.REACT_APP_ENVIRONMENT
      }).init({});

      if(filters) {
        await w3Inst.initComponents(filters);
        await w3Inst.refreshComponents();
      }
      if(!config.isMainnet || process.env.REACT_APP_DAYS_TO_COUNT_FROM) { // run staging env from block number timestamp sub days in env
        const blockTimestamp = await (await w3Inst.block.getBlock()).timestamp;
        w3Inst.forkTimestamp = blockTimestamp - (DAY * process.env.REACT_APP_DAYS_TO_COUNT_FROM);
      }

      setW3(w3Inst);
    } catch(error) {
      console.log(error);
    }
  }, [filters, selectedNetwork])

  const getW3InstanceDebounce = useMemo(() => debounce(getW3Instance, 500), [getW3Instance]);

  useEffect(() => {
    if(filters === null && w3filters) {
      setFilters(w3filters);
    }
  }, [filters, w3filters]);

  useEffect(() => {
    if(!selectedNetwork || !web3?.currentProvider || filters === null) return;
    getW3InstanceDebounce(web3?.currentProvider);

    return () => {
      getW3InstanceDebounce.cancel();
    }
  }, [web3?.currentProvider, selectedNetwork, filters, getW3InstanceDebounce]);

  return w3;
}