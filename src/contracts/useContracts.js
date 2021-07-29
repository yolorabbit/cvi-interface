import { useActiveWeb3React } from "components/Hooks/wallet";
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import Contract from "web3-eth-contract";

export const useContracts = () => {
    const { selectedNetwork } = useSelector(({app}) => app);
    const { library } = useActiveWeb3React();
    const [contracts, setContracts] = useState(null);

    useEffect(() => {
        const loadContracts = () => {
            if(!library?.currentProvider) return;
            const contractsJSON = require(`./files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${selectedNetwork}.json`);
            const contractsKeys = Object.keys(contractsJSON);
            let contractsObject = {};
            Contract.setProvider((selectedNetwork === "Matic" ? process.env.REACT_APP_ENVIRONMENT === "staging" ? "https://staging-polygon.cvi.finance" : "https://polygon-mainnet.infura.io/v3/febfb2edfb47420784373875242fd24d" : "") || library?.currentProvider);

            contractsKeys.forEach((key) => {
                contractsObject[key] = new Contract(contractsJSON[key].abi, contractsJSON[key].address);
            });

            setContracts(contractsObject);
        }

        loadContracts();
        // eslint-disable-next-line
    }, [library]);
    
    return useMemo(() => {
        return contracts;
        //eslint-disable-next-line
    }, [contracts]);
}

