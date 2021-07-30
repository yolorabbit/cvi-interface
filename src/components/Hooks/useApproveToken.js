import config from "config/config";
import { contractsContext } from "contracts/ContractContext";
import { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "store/actions";
import { maxUint256, toBN, toBNAmount } from "utils";
import Contract from "web3-eth-contract";
import { useActiveWeb3React } from "./wallet";

const useApproveToken = () => {
    const { account, library } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const dispatch = useDispatch()
    const { selectedNetwork } = useSelector(({app})=>app);
    
    const allowance = useCallback(async (token, address) => {
        const _contract = getContract(token.key === "govi" ? "GOVI" : token.rel.platform ?? token.rel.token)
        return await _contract.methods.allowance(account, address).call();
    },[account, contracts]);
    
    const approve = useCallback(async (token, address) => {
        const _contract = getContract(token.key === "govi" ? "GOVI" : token.rel.platform ?? token.rel.token)
        return await _contract.methods.approve(address, maxUint256).send({from: account});
    },[account, contracts]);

    const getContract = (contractKey) => {
        const contractsJSON = require(`../../contracts/files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${selectedNetwork}.json`);
        const { abi, address } = contractsJSON[contractKey];
        const _contract = new Contract(abi, address);
        _contract.setProvider(library?.currentProvider);
        return _contract
    }
    

    const approvalValidation = async (token, amount) => {
        const { _address: address } = contracts[token.rel.stakingRewards];
        const approvalValue = await allowance(token, address);
        const compareApprovalWithAmount = toBN(approvalValue).cmp(toBN(toBNAmount(amount, token.decimals)));
        
        if(compareApprovalWithAmount === -1){
            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));
            const allowanceRes = await approve(token, address);
            if(!allowanceRes.status) return false;
        }
        
        return true
    }
    return approvalValidation
}

export default useApproveToken;