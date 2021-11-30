import ActionController from 'components/Actions/ActionController';
import { appViewContext } from 'components/Context';
import { useActiveToken } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import config from 'config/config';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import './Form.scss';

const Form = ({ amount, setAmount, delayFee, setDelayFee, type }) => {
    const { account } = useActiveWeb3React();
    const activeToken = useActiveToken(type); 
    const { w3 } = useContext(appViewContext);
    const tokenContract = w3?.tokens[activeToken.rel.contractKey];
    const [availableBalance, setAvailableBalance] = useState(null);

    const getAvailableBalance = useCallback(async () => {
        const balance = await tokenContract.balanceOf(account);
        setAvailableBalance(balance);
    }, [account, tokenContract]);

    useEffect(() => {
        if(!account) return setAvailableBalance("0");
        if(!tokenContract) return;
        getAvailableBalance();
    }, [account, tokenContract, getAvailableBalance]);

    return useMemo(() => {
        if(!activeToken?.name) return;

        return (
            <div className="arbitrage-form-component">
                <ActionController
                    view={config.routes.arbitrage.path}
                    delayFee={delayFee}
                    setDelayFee={setDelayFee}
                    amount={amount}
                    setAmount={setAmount}
                    token={activeToken.name}
                    type={type}
                    balances={{ tokenAmount: availableBalance }}
                    disabled={!amount} 
                />
                <SeeMore />
            </div>
        );
    }, [activeToken.name, amount, availableBalance, delayFee, setAmount, setDelayFee, type]);
}

const SeeMore = () => {
    return useMemo(() => {
        return <div className="see-more-component">
            <span>Please note that the submitted requests expire after 12 hours. You won’t be able to fulfill Mint/Burn request after it is expired.</span>
        </div>
    }, []);
}

export default Form;