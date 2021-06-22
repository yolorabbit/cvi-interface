import { useCallback, useEffect, useRef } from "react";
import { useContext } from "react";
import { viewportContext } from "../Context";

export const useViewport = () => {
  const { width, height } = useContext(viewportContext);
  return { width, height };
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

export const useInDOM = () => {
    const isMounted = useRef(false);
    useEffect(() => {
      isMounted.current = true;
      return () => isMounted.current = false;
    }, []);
    
    return useCallback(() => isMounted.current, []);
};
  