import { useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { viewportContext } from "../Context";
import platformConfig from '../../config/platformConfig';
import stakingConfig from "config/stakingConfig";
import config from "config/config";

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

export const useActiveToken = (selectedCurrency, view, protocol) => {
  const { selectedNetwork } = useSelector(({app}) => app);
  if(view === "staking") return stakingConfig.tokens[selectedNetwork][protocol][selectedCurrency?.toLowerCase()]
  return platformConfig.tokens[selectedNetwork][selectedCurrency?.toLowerCase()];
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

    return volsInfo[config.volatilityKey[volKeyOrOracle] 
      || config.volatilityKey[config.volatilityOracles[volKeyOrOracle]]] 
      || null;
}