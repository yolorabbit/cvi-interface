import { useInDOM } from "components/Hooks";
import { useEvents } from "components/Hooks/useEvents";
import { useActiveWeb3React } from "components/Hooks/wallet";
import platformConfig from "config/platformConfig";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { contractsContext } from "./ContractContext";
import web3Api from "./web3Api";

const getActiveToken = (tokens, token) => {
    return tokens.find(({key}) => key === token?.toLowerCase());
}

export const useWeb3Api = (type, selectedCurrency, body, options) => {
    const isActiveInDOM = useInDOM();
    const eventsUpdateRef = useRef(null);
    const ref = useRef(null);
    const { positions, liquidities } = useSelector(({wallet}) => wallet);
    const { library } = useActiveWeb3React();
    const { selectedNetwork } = useSelector(({app}) => app);
    const contracts = useContext(contractsContext);
    const [data, setData] = useState();
    const eventsUtils = useEvents();
    const errorValue = useMemo(() => options?.errorValue ?? 'N/A', [options]);

    const fetchWeb3ApiData = useCallback(async (contracts, tokens) => {
        try {
            if(web3Api[type]) {
                if(selectedCurrency) {
                    const token = getActiveToken(tokens, selectedCurrency);
                    if(!token) return setData(errorValue);
                    const data = await web3Api[type](contracts, token, {library, eventsUtils, ...body});
                    if(isActiveInDOM()) setData(data === 'N/A' ? options?.errorValue ?? 'N/A' : data);
                    return data;
                } else {
                    const data = await web3Api[type](contracts, tokens, {library, eventsUtils, ...body});
                    if(isActiveInDOM()) setData(data === 'N/A' ? options?.errorValue ?? 'N/A' : data);
                    return data;
                }
            } else {
                if(isActiveInDOM()) setData(errorValue);
                return errorValue;
            }
        } catch(error) {
            console.log(error);
            if(isActiveInDOM()) setData(errorValue);
            return errorValue;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [body, errorValue, eventsUtils, library, options?.errorValue, selectedCurrency, type])

    const getData = useCallback(async () => {
        try {
            if(data !== null) setData(null);
            const tokens = Object.values(platformConfig.tokens[selectedNetwork]).filter(({soon}) => !soon);
            return await fetchWeb3ApiData(contracts, tokens);
        } catch(error) {
            if(isActiveInDOM()) setData(errorValue);
            return errorValue;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contracts, data, errorValue, fetchWeb3ApiData, selectedNetwork])
    
    useEffect(() => {
        if(options?.updateOn === "positions") {
            eventsUpdateRef.current = setTimeout(() => {
                getData();
            }, 1000);
        }
        return () => {
            if(eventsUpdateRef.current) clearTimeout(eventsUpdateRef.current);
        }
        //eslint-disable-next-line
    }, [positions?.length]);

    useEffect(() => {
        if(options?.updateOn === "liquidities") {
            if(!liquidities?.length > 0) return;
            eventsUpdateRef.current = setTimeout(() => {
                getData();
            }, 1000);
        }
        return () => {
            if(eventsUpdateRef.current) clearTimeout(eventsUpdateRef.current);
        }
        //eslint-disable-next-line
    }, [liquidities?.length]);

    useEffect(() => {
        if(!isActiveInDOM()) return; 
        if(!selectedNetwork || !contracts || !library?.currentProvider) return null;
        if(body?.hasOwnProperty('account') && !body.account) return setData("0");
        if(options?.validAmount && body?.hasOwnProperty("tokenAmount") && (body?.tokenAmount?.isZero() || !body?.tokenAmount)) return setData("0");
        if(options?.updateOn === "positions") return setData(null);

        setData(null);
        ref.current = setTimeout(() => {
            getData();
        }, 750);

        return () => {
            if(ref.current) {
                return clearTimeout(ref.current);
            }
        }
        //eslint-disable-next-line
    }, [selectedNetwork, contracts, library, selectedCurrency, body]);

    return useMemo(() => {
        return [data, getData]
    }, [data, getData]) ;
}