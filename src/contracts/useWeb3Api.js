import { useEvents } from "components/Hooks/useEvents";
import { useActiveWeb3React } from "components/Hooks/wallet";
import platformConfig from "config/platformConfig";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { contractsContext } from "./ContractContext";
import web3Api from "./web3Api";

const getActiveToken = (tokens, token) => {
    return tokens.find(({key}) => key === token?.toLowerCase());
}

export const useWeb3Api = (type, selectedCurrency, body, options) => {
    const { library } = useActiveWeb3React();
    const { selectedNetwork } = useSelector(({app}) => app);
    const contracts = useContext(contractsContext);
    const [data, setData] = useState();
    const ref = useRef(null);
    const eventsUtils = useEvents();

    useEffect(() => {
        setData(null);
    }, [selectedCurrency]);

    const fetchWeb3ApiData = async (contracts, tokens) => {
        try {
            if(web3Api[type]) {
                if(selectedCurrency) {
                    const token = getActiveToken(tokens, selectedCurrency);
                    if(!token) return setData("N/A");
                    const data = await web3Api[type](contracts, token, {library, eventsUtils, ...body});
                    setData(data);
                    return data;
                } else {
                    const data = await web3Api[type](contracts, tokens, {library, eventsUtils, ...body});
                    setData(data);
                    return data;
                }
            } else {
                setData("N/A");
                return "N/A";
            }
        } catch(error) {
            setData("N/A");
            return "N/A";
        }
    }

    const getData = async () => {
        try {
            setData(null);
            const tokens = Object.values(platformConfig.tokens[selectedNetwork]).filter(({soon}) => !soon);
            return await fetchWeb3ApiData(contracts, tokens);
        } catch(error) {
            setData("N/A");
            return "N/A";
        }
    }

    useEffect(() => {
        if(!selectedNetwork || !contracts || !library?.currentProvider) return null;
        if(body?.hasOwnProperty('account') && !body.account) return setData("0");
        if(options?.validAmount && body?.hasOwnProperty("tokenAmount") && (body?.tokenAmount?.isZero() || !body?.tokenAmount)) return setData("0");
        
        ref.current = setTimeout(() => {
            getData();
        }, 500);

        return () => {
            if(ref.current) return clearTimeout(ref.current);
        }
        //eslint-disable-next-line
    }, [selectedNetwork, contracts, library, selectedCurrency, body]);

    return [data, getData];
}