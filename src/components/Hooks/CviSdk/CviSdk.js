import { getW3 } from "@coti-io/cvi-sdk";
import config from "config/config";
import { chainNames } from "connectors";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { DAY } from "../useEvents";
import { useActiveWeb3React } from "../wallet";

const useCviSdk = () => {
    const [w3, setW3] = useState();
    const { library: web3 } = useActiveWeb3React();
    const { selectedNetwork } = useSelector(({app}) => app);
  
    const getW3Instance = useCallback(async (provider) => {
      try {
        let w3Inst = await getW3(selectedNetwork === chainNames.Matic ? 'Polygon' : selectedNetwork, {
          provider, 
          env: process.env.REACT_APP_ENVIRONMENT === "mainnet" ? "live" : process.env.REACT_APP_ENVIRONMENT
        });
        
        if(!config.isMainnet || process.env.REACT_APP_DAYS_TO_COUNT_FROM) { // run staging env from block number timestamp sub days in env
          const blockTimestamp = await w3Inst.block.getBlock().timestamp;
          w3Inst.forkTimestamp = blockTimestamp - (DAY * process.env.REACT_APP_DAYS_TO_COUNT_FROM);
        }
  
        setW3(w3Inst);
      } catch(error) {
        console.log(error);
      }
    }, [selectedNetwork])
  
    const getW3InstanceDebounce = useMemo(() => debounce(getW3Instance, 500), [getW3Instance]);
  
    
  
    useEffect(() => {
      if(!selectedNetwork || !web3?.currentProvider) return;
      getW3InstanceDebounce(web3?.currentProvider);
  
      return () => {
        getW3InstanceDebounce.cancel();
      }
    }, [web3?.currentProvider, selectedNetwork, getW3InstanceDebounce]);
  
    return w3;
  }

  export default useCviSdk;