import { platformViewContext } from 'components/Context';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import CurrencySelect from 'components/CurrencySelect';
import SelectLeverage from 'components/SelectLeverage';
import Details from './Details/Details';
import platformConfig, { activeViews } from 'config/platformConfig';
import ActionController from 'components/Actions/ActionController';
import { useSelector } from 'react-redux';
import { contractsContext } from 'contracts/ContractContext';
import { useInDOM, useIsTablet } from 'components/Hooks';
import { useWeb3Api } from 'contracts/useWeb3Api';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import Graphs from '../Graphs';
import './Form.scss';

const Form = ({activeTab}) => {
    const isTablet = useIsTablet();
    const { account } = useActiveWeb3React();
    const { activeView } = useContext(platformViewContext);
    const { selectedNetwork } = useSelector(({app}) => app);
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    const tokenLeverageList = platformConfig.tokens?.[selectedNetwork]?.[selectedCurrency]?.leverage;
    const [leverage, setLeverage] = useState(tokenLeverageList?.[0]);
    const [amount, setAmount] = useState("");
    const type = activeView === "trade" ? platformConfig.actionsConfig.buy.key : platformConfig.actionsConfig.deposit.key;
    const availableBalancePayload = useMemo(() => ({account, type}), [account, type]);
    const availableBalanceOptions = useMemo(() => ({updateOn: activeView === "trade" ? 'positions' : 'liquidities', errorValue: "0"}), [activeView]);
    const [availableBalance, getAvailableBalance] = useWeb3Api("getAvailableBalance", selectedCurrency, availableBalancePayload, availableBalanceOptions);

    const updateAvailableBalance = () => {
      getAvailableBalance();
    }

    useEffect(() => {
        if(!platformConfig.tokens[selectedCurrency]?.leverage) setLeverage("1");
        
        if(tokenLeverageList?.length > 0) {
            setLeverage(tokenLeverageList?.[0]);
        }
        //eslint-disable-next-line
    }, [selectedCurrency]);

    return useMemo(() => {
        return (
            <div className="platform-form-component">
               <div className="platform-form-component__left">
                    <CurrencySelect 
                        selectedCurrency={selectedCurrency} 
                        setSelectedCurrency={setSelectedCurrency} 
                        activeVolIndex={activeTab}
                    />

                    {activeView === 'trade' 
                        && platformConfig.tokens?.[selectedNetwork]?.[selectedCurrency]?.leverage 
                        && <SelectLeverage selectedCurrency={selectedCurrency} leverage={leverage} tokenLeverageList={tokenLeverageList} setLeverage={setLeverage} /> }
                  
                    <ActionController 
                        disabled={!amount}
                        amount={amount}
                        setAmount={setAmount}
                        token={selectedCurrency}
                        leverage={leverage}
                        type={type}
                        balances={{
                            tokenAmount: availableBalance
                        }}
                        cb={updateAvailableBalance}
                    />

                    {!isTablet && <SeeMore selectedCurrency={selectedCurrency?.toUpperCase()}/>}
               </div>
    
               <div className="platform-form-component__middle">
                    <Details 
                        activeVolIndex={activeTab}
                        selectedCurrency={selectedCurrency?.toUpperCase()} 
                        amount={amount} 
                        leverage={leverage} 
                    />
               </div>

               <div className="platform-form-component__right">
                    <Graphs 
                        activeVolIndex={activeTab}
                        tabs={["index", "fee"]} 
                    />  
                </div>

                {isTablet && <SeeMore selectedCurrency={selectedCurrency?.toUpperCase()}/>}
            </div>
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCurrency, activeTab, activeView, selectedNetwork, leverage, tokenLeverageList, amount, type, availableBalance, isTablet]) 
}

const SeeMore = ({selectedCurrency}) => {
    const { activeView } = useContext(platformViewContext);
    const { selectedNetwork } = useSelector(({app}) => app);
    const contracts = useContext(contractsContext);
    const [lockup, setLockup] = useState(48);
    const platfromName = platformConfig.tokens[selectedNetwork][selectedCurrency.toLowerCase()]?.rel.platform;
    const isActiveInDom = useInDOM();
    
    useEffect(()=>{
        if(!contracts || !selectedNetwork || !selectedCurrency) return
        const getLockup = async (cb) => {
            try{
                const locktime = await contracts[platfromName].methods.lpsLockupPeriod().call();
                if(isActiveInDom()) {
                    setLockup(locktime / 60 / 60)
                }
            } catch (error) {
                console.log("getLockuptime error: ", error);
            }
        }

        let canceled = false;

        getLockup((cb)=>{
            if(canceled) return
            cb()
        });

        return () => {
            canceled = true;
        }
    //eslint-disable-next-line
    },[selectedCurrency, selectedNetwork, contracts]);

    return useMemo(() => {
        return <div className="platform-form-component__bottom">
            {activeView === activeViews.trade ? <p>
                <b>Pay Attention: </b> 
                GOVI tokens will become claimable starting the day after your last open position action (UTC time) and for a period not exceeding 30 days.
                <br/>Please also note that you won't be able to sell your position within the next 6 hours.
            </p> : <p><b>Pay Attention: </b>you won't be able to withdraw your liquidity within the next {lockup} hours.</p>}
        </div>
    }, [activeView, lockup]);
}

export default Form;