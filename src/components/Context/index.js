import { createContext, useEffect, useRef, useState } from "react";
import { useContracts } from '../Hooks/contracts';

export const viewportContext = createContext({});
export const platformViewContext = createContext("");
export const contractsContext = createContext(null);

export const ContractsContext = ({children}) => {
  const contracts = useContracts();

  return <contractsContext.Provider value={contracts}>
    {children}
  </contractsContext.Provider>
}

export const ViewportProvider = ({ children }) => {
  // This is the exact same logic that we previously had in our hook
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const ref = useRef();

  const handleWindowResize = () => {
    if(ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, 750);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      if(ref.current) clearTimeout(ref.current);
      window.removeEventListener("resize", handleWindowResize);
    }
  }, []);

  /* Now we are dealing with a context instead of a Hook, so instead
     of returning the width and height we store the values in the
     value of the Provider */
  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};