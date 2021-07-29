import Button from 'components/Elements/Button';
import { useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { useContext } from 'react';
import { contractsContext } from '../../contracts/ContractContext';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { actionConfirmEvent, gas, maxUint256, toBN, toBNAmount } from '../../utils/index';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import platformConfig from 'config/platformConfig';
import Contract from 'web3-eth-contract';

const Deposit = () => {
    const dispatch = useDispatch(); 
    const isActiveInDOM = useInDOM();
    const { disabled, type, setIsOpen, token, amount, setAmount, updateAvailableBalance } = useActionController();
    const { account, library } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const activeToken = useActiveToken(token);
    const [isProcessing, setProcessing] = useState();
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const { selectedNetwork } = useSelector(({app}) => app);
    
    const getContract = (contractKey) => {
        const contractsJSON = require(`../../contracts/files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${selectedNetwork}.json`);
        const { abi, address } = contractsJSON[contractKey];
        const _contract = new Contract(abi, address);
        _contract.setProvider(library?.currentProvider);
        return _contract
    }

    const allowance = async (_account) => {
        const _contract = getContract(activeToken.rel.contractKey);
        return await _contract.methods.allowance(account, _account).call();
    }

    const approve = async (_address) => {
        const _contract = getContract(activeToken.rel.contractKey);
        return await _contract.methods.approve(_address, maxUint256).send({from: account});
    }

    const approvalValidation = async () => {
        const isETH = token === 'eth';
        if(isETH) return true;
        const { _address } = contracts[activeToken.rel.platform];
        const approvalValue = await allowance(_address);
        const compareApprovalWithAmount = toBN(approvalValue).cmp(tokenAmount);
        if(compareApprovalWithAmount === -1){
            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));
            const allowanceRes = await approve(_address);
            if(!allowanceRes.status) return false;
        }
        return true;
    }

    const deposit = async () => {
        const _contract = getContract(activeToken.rel.platform);
        if(activeToken.type === "eth") return await _contract.methods.depositETH(toBN('0')).send({ from: account, value: tokenAmount, ...gas });
        return await _contract.methods.deposit(tokenAmount, toBN('0')).send({from: account, ...gas});
    }

    const onClick = async () => {
        setProcessing(true);
        
        try {
            const isApprove = await approvalValidation();

            if(!isApprove) {
                if(isActiveInDOM()) {
                    setProcessing(false);
                }
                return;
            }

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));
            const res = await deposit();
            
            if(res.status) {
                dispatch(addAlert({
                    id: 'deposit',
                    eventName: "Deposit liquidity - success",
                    alertType: config.alerts.types.CONFIRMED,
                    message: "Transaction success!"
                }));

                actionConfirmEvent(dispatch);
            }
        } catch (error) {
            console.log(error);
            dispatch(addAlert({
                id: 'deposit',
                eventName: "Deposit liquidity - failed",
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
        } finally {
            if(isActiveInDOM()) {
                setProcessing(false);
                setAmount("");
                updateAvailableBalance();
                setIsOpen(false);
            }
        }
    }

    return (
        <> 
            <div className="deposit-component">
                <Button 
                    className="button" 
                    buttonText={platformConfig.actionsConfig?.[type]?.key?.toUpperCase()}
                    onClick={onClick}
                    disabled={disabled}
                    processing={isProcessing}
                />
            </div>
        </>
    )
}

export default Deposit;