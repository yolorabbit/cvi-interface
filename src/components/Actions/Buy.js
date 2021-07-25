import Button from 'components/Elements/Button';
import { useCallback, useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { useContext } from 'react';
import { contractsContext } from './../../contracts/ContractContext';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useWeb3Api } from './../../contracts/useWeb3Api';
import { commaFormatted, gas, maxUint256, toBN, toBNAmount, toDisplayAmount } from './../../utils/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fromUnitsToTokenAmount, MAX_CVI_VALUE } from 'contracts/apis/position';
import { addAlert } from 'store/actions';
import config from './../../config/config';
import platformConfig from 'config/platformConfig';
import ErrorModal from 'components/Modals/ErrorModal';

const feesHighWarningMessage = "This transaction will not succeed due to the change in the purchase fee. Please review your trade details and resubmit your purchase request";

const Buy = () => {
    const dispatch = useDispatch();
    const isActiveInDOM = useInDOM();
    const { disabled, type, token, setIsOpen, amount, setAmount, leverage, updateAvailableBalance } = useActionController();
    const { account, library } = useActiveWeb3React();
    const [modalIsOpen, setModalIsOpen] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const contracts = useContext(contractsContext);
    const activeToken = useActiveToken(token);
    const [isProcessing, setProcessing] = useState();
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const purchaseFeePayload = useMemo(() => ({ tokenAmount,leverage } ), [tokenAmount, leverage]);
    const [purchaseFee, getPurchaseFees] = useWeb3Api("getOpenPositionFee", token, purchaseFeePayload, { validAmount: true});
    const [collateralRatioData] = useWeb3Api("getCollateralRatio", token);

    const allowance = useCallback(async (_account) => {
        return await contracts[activeToken.rel.contractKey].methods.allowance(account, _account).call()
    }, [account, activeToken, contracts]);

    const approve = useCallback(async (_address) => {
        return await contracts[activeToken.rel.contractKey].methods.approve(_address, maxUint256).send({from: account});
    }, [account, activeToken, contracts]);
    
    const approvalValidation = useCallback(async () => {
        const isETH = token === 'eth';
        if(isETH) return true;
        const { _address } = contracts[activeToken.rel.platform];
        const approvalValue = await allowance(_address);
        const compareApprovalWithAmount = toBN(approvalValue).cmp(tokenAmount);
        if(compareApprovalWithAmount === -1){
            const allowanceRes = await approve(_address);
            if(!allowanceRes.status) return false;
        }
        return true;
    }, [activeToken, contracts, token, tokenAmount, approve, allowance]);

    const toggleModal = async(flag) => {
        setModalIsOpen(flag);
    }

    const getMaxAmount = useCallback(async (index) => {
        let totalBalance = toBN(
            token === 'eth' ? await library.eth.getBalance(contracts[activeToken.rel.platform]._address) : 
            token === "usdc" ? await toBN(await contracts[activeToken.rel.platform].methods.totalLeveragedTokensAmount().call()) :
            await contracts[activeToken.rel.contractKey].methods.balanceOf(contracts[activeToken.rel.platform]._address).call()
        )
        let totalUnits = await contracts[activeToken.rel.platform].methods.totalPositionUnitsAmount().call();
        return fromUnitsToTokenAmount(totalBalance.sub(toBN(totalUnits)), index).div(toBN(leverage));
    }, [library?.eth, activeToken, contracts, token, leverage]);

    const getMaxAvailableToOpen = useCallback(async () => {
        try {
            const index = toBNAmount(cviInfo.price, 2);
            let totalToOpen = await getMaxAmount(index);
            return [totalToOpen.cmp(toBN(toBNAmount(amount, activeToken.decimals))) > -1, toDisplayAmount(totalToOpen.toString(), activeToken.decimals)];
        } catch(error) {
            console.log(error);
        }
    }, [cviInfo, activeToken, amount, getMaxAmount]);

    const feesValidation = useCallback(async () => {
        let fees = await getPurchaseFees();
        // true for valid fees
        return fees !== "N/A" && purchaseFee !== "N/A" ? toBN(fees.buyingPremiumFeePercent).cmp(toBN(purchaseFee.buyingPremiumFeePercent)) !== 1 : true;
    }, [purchaseFee, getPurchaseFees])

    const buy = useCallback(async () => {
        const _leverage = !leverage ? "1" : leverage;
        if (activeToken.type === "eth") {
            return await contracts[activeToken.rel.platform].methods.openPositionETH(MAX_CVI_VALUE, purchaseFee.buyingPremiumFeePercent, _leverage).send({ from: account, value: tokenAmount, ...gas });
        } else if (activeToken.type === "v2" || activeToken.type === "usdc") {
            return await contracts[activeToken.rel.platform].methods.openPosition(tokenAmount, MAX_CVI_VALUE, purchaseFee.buyingPremiumFeePercent, _leverage).send({ from: account, ...gas });
        } else {
            return await contracts[activeToken.rel.platform].methods.openPosition(tokenAmount, MAX_CVI_VALUE).send({ from: account, ...gas });
        }
    }, [account, activeToken, tokenAmount, contracts, leverage, purchaseFee])

    const onClick = useCallback(async () => {
        const [allowToBuy, totalToOpen] = await getMaxAvailableToOpen();
        if(!allowToBuy) {
            if(isActiveInDOM()) {
                setModalIsOpen(true);
                setErrorMessage(`There is not enough available liquidity to cover your position. Please select an amount lower than ${commaFormatted(totalToOpen)} ${token.toUpperCase()} or try again later.`)
            }
            return;
        }

        const feeIsValid = await feesValidation();

        if(!feeIsValid) {
            setModalIsOpen(true);
            setErrorMessage(feesHighWarningMessage);
            return;
        }

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
                message: "Please confirm the transaction in your wallet."
            }));
            const res = await buy();
                
            if(res.status) {
                dispatch(addAlert({
                    id: 'openPosition',
                    eventName: "Buy position - success",
                    alertType: config.alerts.types.CONFIRMED,
                    message: "Transaction success!"
                }));
            }
        } catch (error) {
            console.log(error);
            if(error?.message.toLowerCase().search('revert not enough liquidity') !== -1) {
                if(isActiveInDOM()) { 
                    setModalIsOpen(true);
                    setErrorMessage("There is not enough available liquidity to cover your position. Please buy a lower amount or try again later.")
                }
            }
            else if(error?.message.toLowerCase().search('premium fee too high') !== -1) {
                setModalIsOpen(true);
                setErrorMessage("The transaction has failed due to the change in the purchase fee.")
            } 
            else {
                dispatch(addAlert({
                    id: 'openPosition',
                    eventName: "Buy position - failed",
                    alertType: config.alerts.types.FAILED,
                    message: "Transaction failed!"
                }));
            }
        } finally {
            if(isActiveInDOM()) {
                setProcessing(false);
                setAmount("");
                updateAvailableBalance();
                setIsOpen(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approvalValidation, buy, dispatch, feesValidation, getMaxAvailableToOpen, isActiveInDOM, setAmount, token, updateAvailableBalance])

    return useMemo(() => {
        return  (
            <> 
                {modalIsOpen && <ErrorModal error={errorMessage} setModalIsOpen={toggleModal} isWarning={errorMessage === feesHighWarningMessage}/> }
                <div className="buy-component">
                    <Button 
                        className="button" 
                        buttonText={platformConfig.actionsConfig?.[type]?.key?.toUpperCase()}
                        onClick={onClick}
                        disabled={disabled || purchaseFee === "N/A" || purchaseFee === null || collateralRatioData === null || collateralRatioData === "N/A"}
                        processing={isProcessing || purchaseFee === null}
                        processingText={amount > 0 && purchaseFee === null && "Calculating"}
                    />
                </div>
            </>
        )
    }, [amount, collateralRatioData, disabled, errorMessage, isProcessing, modalIsOpen, onClick, purchaseFee, type])
}

export default Buy;