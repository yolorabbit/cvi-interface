import { useCallback, useEffect, useRef } from "react";
import { useContext } from "react";
import { viewportContext } from "../Context";

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
