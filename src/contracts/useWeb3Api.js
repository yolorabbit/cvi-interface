import { useActiveWeb3React } from "components/Hooks/wallet";
import platformConfig from "config/platformConfig";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { contractsContext } from "./ContractContext";
import web3Api from "./web3Api";

const getActiveToken = (tokens, token) => {
    return tokens.find(({key}) => key === token?.toLowerCase());
}

export const useWeb3Api = (type, selectedCurrency, body) => {
    const { library } = useActiveWeb3React();
    const { selectedNetwork } = useSelector(({app}) => app);
    const contracts = useContext(contractsContext);
    const [data, setData] = useState();
    const ref = useRef(null);

    const fetchWeb3ApiData = async (contracts, tokens) => {
        console.log("fetch");
        try {
            if(web3Api[type]) {
                if(selectedCurrency) {
                    const token = getActiveToken(tokens, selectedCurrency);
                    const data = await web3Api[type](contracts, token, {library, ...body});
                    setData(data);
                } else {
                    const data = await web3Api[type](contracts, tokens, {library, ...body});
                    setData(data);
                }
            } else setData("N/A");
        } catch(error) {
            setData("N/A");
        }
    }

    useEffect(() => {
        console.log(body);
        if(!selectedNetwork || !contracts || !library?.currentProvider) return null;
        const tokens = Object.values(platformConfig.tokens[selectedNetwork]).filter(({soon}) => !soon);
        ref.current = setTimeout(() => {
            fetchWeb3ApiData(contracts, tokens);
        }, 300);

        return () => {
            if(ref.current) return clearTimeout(ref.current);
        }
        //eslint-disable-next-line
    }, [selectedNetwork, contracts, library, selectedCurrency, body]);

    return data
}