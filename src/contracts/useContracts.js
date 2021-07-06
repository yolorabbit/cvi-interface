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
            Contract.setProvider(library?.currentProvider);

            contractsKeys.forEach((key) => {
                contractsObject[key] = new Contract(contractsJSON[key].abi, contractsJSON[key].address);
            });

            setContracts(contractsObject);
        }

        loadContracts();
    }, [selectedNetwork, library]);
    
    return useMemo(() => {
        return contracts;
        //eslint-disable-next-line
    }, [selectedNetwork, contracts]);
}

