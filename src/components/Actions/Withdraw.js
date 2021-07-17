import Button from 'components/Elements/Button';
import { useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { useContext } from 'react';
import { contractsContext } from '../../contracts/ContractContext';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { commaFormatted, gas, toBN, toBNAmount, toDisplayAmount } from '../../utils/index';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import { fromUnitsToTokenAmount } from 'contracts/apis/position';
import CountdownComponent, { useIsLockedTime } from 'components/Countdown/Countdown';
import web3Api from 'contracts/web3Api';
import ErrorModal from 'components/Modals/ErrorModal';
import WithdrawInfo from 'components/pages/Platform/Info/WithdrawInfo';

const Withdraw = () => {
    const dispatch = useDispatch(); 
    const isActiveInDOM = useInDOM();
    const { library } = useActiveWeb3React();
    const { isOpen, setIsOpen, isModal, disabled, token, amount, setAmount, updateAvailableBalance } = useActionController();
    const { account } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const activeToken = useActiveToken(token);
    const [isProcessing, setProcessing] = useState();
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const lockedTime = useIsLockedTime();
    const [errorMessage, setErrorMessage] = useState();
    const { cviInfo } = useSelector(({app}) => app.cviInfo);

    const getMaxAmount = async (index) => {
        let totalBalance = toBN(
            token === 'eth' ? await library.eth.getBalance(contracts[activeToken.rel.platform]._address) : 
            await contracts[activeToken.rel.contractKey].methods.balanceOf(contracts[activeToken.rel.platform]._address).call()
        )
        let totalUnits = await contracts[activeToken.rel.platform].methods.totalPositionUnitsAmount().call();
        return fromUnitsToTokenAmount(totalBalance.sub(toBN(totalUnits)), index);
    }

    const getMaxAvailableToWithdraw = async () => {
        try {
            const index = toBNAmount(cviInfo.price, 2);
            let totalToWithdraw = await getMaxAmount(index);
            return [toBN(toBNAmount(amount, activeToken.decimals)).cmp(totalToWithdraw) < 1, toDisplayAmount(totalToWithdraw.toString(), activeToken.decimals)]
        } catch(error) {
            console.log(error);
        }
    }

    const withdraw = async () => {
        const lpTokens = await web3Api.toLPTokens(contracts, activeToken, { tokenAmount });
        await contracts[activeToken.rel.platform].methods.withdrawLPTokens(toBN(lpTokens)).send({from: account, ...gas});
    }

    const onClick = async () => {
        if(!isOpen) {
            updateAvailableBalance();
            return setIsOpen(true);
        }
        setProcessing(true);
        
        try {
            const [allowToWithdraw, max_amount] = await getMaxAvailableToWithdraw();
            if(!allowToWithdraw) {
                setErrorMessage(`Part of the liquidity you've provided is used as collateral and can't be currently withdrawn. Please select an amount less than ${commaFormatted(max_amount)} ${token.toUpperCase()} or try again later.`)
                return setProcessing(false);
            }

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));

            await withdraw();

            dispatch(addAlert({
                id: 'withdraw',
                eventName: "Withdraw liquidity - success",
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));

        } catch (error) {
            console.log(error);
            if(error?.message.toLowerCase().search('revert collateral ratio broken') !== -1) {
                setErrorMessage("Part of the liquidity you've provided is used as collateral and can't be currently withdrawn. Please select a lower amount or try again later.")
            } else {
                dispatch(addAlert({
                    id: 'withdraw',
                    eventName: "Withdraw liquidity - failed",
                    alertType: config.alerts.types.FAILED,
                    message: "Transaction failed!"
                }));
            }
        } finally {
            if(isActiveInDOM()) {
                setProcessing(false);
                setAmount("");
                updateAvailableBalance();
            }
        }
    }

    return (
        <> 
            {errorMessage && <ErrorModal error={errorMessage} setModalIsOpen={setErrorMessage}/>}
            <div className="withdraw-component">
                <div className="withdraw-component__container">
                    {(isOpen && !isModal) && <WithdrawInfo />}
                    {(!isOpen && !isModal) && <CountdownComponent lockedTime={lockedTime} /> }
                    <Button 
                        className="withdraw-component__container--button"
                        buttonText="Withdraw" 
                        onClick={onClick}
                        processing={isProcessing}
                        disabled={(isOpen && !isModal && (disabled || tokenAmount?.isZero())) || (lockedTime > 0 || lockedTime === null)}
                    />
                </div>
            </div>
        </>
    )
}

export default Withdraw;