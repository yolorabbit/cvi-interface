import { platformViewContext } from "components/Context";
import { useContext, useMemo } from "react";
import { commaFormatted, customFixed, customFixedTokenValue, toBN, toBNAmount, toDisplayAmount } from "utils";
import Stat from "components/Stat";
import { useSelector } from "react-redux";
import { useWeb3Api } from "contracts/useWeb3Api";
import { useActiveToken } from '../../../../Hooks';
import './Details.scss';
import { toTokenAmount } from "contracts/utils";

const Details = ({selectedCurrency, amount, leverage}) => {
    const { activeView } = useContext(platformViewContext);
 
    return useMemo(() => {
        return (
            <div className="platform-form-details-component">
                <div className="platform-form-details-component__container">
                    {activeView === "trade" ? <TradeView 
                        amount={amount} 
                        selectedCurrency={selectedCurrency} 
                        leverage={leverage}
                    /> : <LiquidityView 
                            amount={amount} 
                            selectedCurrency={selectedCurrency} 
                        />}
                </div>
            </div>
        )
    }, [selectedCurrency, activeView, amount, leverage]); 
}

const TradeView = ({amount, leverage, selectedCurrency}) => {
    const activeToken = useActiveToken(selectedCurrency);
    const collateralRatioData = useWeb3Api("getCollateralRatio", selectedCurrency);
    const tokenAmount = toBN(toBNAmount(amount, activeToken.decimals));
    const body = useMemo(() => ({ tokenAmount } ), [tokenAmount]);
    const purchaseFee = useWeb3Api("getOpenPositionFee", selectedCurrency, body);
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
   
    return useMemo(() => {
        const receiveAmount = toDisplayAmount(tokenAmount.sub(toBN(purchaseFee?.openFee?.toString())), activeToken.decimals);
        
        return  (
            <> 
                <Stat 
                    name="collateralRatio" 
                    value={collateralRatioData?.collateralRatio} 
                    format={`${customFixedTokenValue(collateralRatioData?.collateralRatio, 0, 8)}%`}
                    className={`bold ${customFixedTokenValue(collateralRatioData?.collateralRatio, 0, 8) >= 80 ? 'low' : 'high'}`} 
                />
        
                {leverage && <Stat className="bold" title="Leverage" value={leverage} /> }
    
                <Amount title="Buy" amount={amount} selectedCurrency={selectedCurrency} />
    
                <Stat 
                    title="Purchase fee" 
                    value={purchaseFee === "N/A" ? purchaseFee : purchaseFee?.openFee?.toString()} 
                    _suffix={selectedCurrency}
                    className="low" 
                    format={toDisplayAmount(purchaseFee?.openFee?.toString(), activeToken.decimals)}
                />
    
                <Stat 
                    className="bold green" 
                    title="Your position" 
                    value={receiveAmount === "N/A" ? "N/A" : receiveAmount} 
                    _suffix={selectedCurrency} 
                />
    
                <Stat title="Open position reward" value="100 GOVI" />
    
                <Stat title="Current funding fee" value={`0.01 ${selectedCurrency}`} />
    
                <Stat title="CVI Index" value={cviInfo?.price} />
            </>
        )
    }, [collateralRatioData, cviInfo?.price, amount, tokenAmount, leverage, purchaseFee, selectedCurrency, activeToken]) 
   
}

const LiquidityView = ({amount, selectedCurrency}) => {
    const collateralRatioData = useWeb3Api("getCollateralRatio", selectedCurrency);
    const { cviInfo } = useSelector(({app}) => app.cviInfo);

    return useMemo(() => {
        return  <> 
           <Stat 
                name="collateralRatio" 
                value={collateralRatioData?.collateralRatio} 
                format={`${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0)}%`}
                className={`bold ${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0) >= 80 ? 'low' : 'high'}`} 
            />

            <Amount title="Deposit" amount={amount} selectedCurrency={selectedCurrency} />

            <Stat className="bold" title="You will receive" value={`0.4 CVI-${selectedCurrency}-LP`} />

            <Stat title="CVI Index" value={cviInfo?.price} />
        </>
    }, [collateralRatioData, amount, selectedCurrency, cviInfo?.price])
}

const Amount = ({title, amount, selectedCurrency}) => {
    return (
        <div className="platform-form-details-component__container--amount">
            <span>{title} amount</span>
            <b>{commaFormatted(amount || 0)} {selectedCurrency}</b>
        </div>
    )
}

export default Details;