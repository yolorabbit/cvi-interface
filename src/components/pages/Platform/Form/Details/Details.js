import { platformViewContext } from "components/Context";
import { useContext, useEffect, useMemo, useState } from "react";
import { commaFormatted, customFixed, customFixedTokenValue, toBN, toBNAmount, toDisplayAmount } from "utils";
import Stat from "components/Stat";
import { useSelector } from "react-redux";
import { useWeb3Api } from "contracts/useWeb3Api";
import { useActiveToken } from '../../../../Hooks';
import { useActiveWeb3React } from "components/Hooks/wallet";
import './Details.scss';
import platformConfig from "config/platformConfig";

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
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    const { account } = useActiveWeb3React();

    const activeToken = useActiveToken(selectedCurrency);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);

    const collateralRatioData = useWeb3Api("getCollateralRatio", selectedCurrency);

    const purchaseFeePayload = useMemo(() => ({ tokenAmount } ), [tokenAmount]);
    const purchaseFee = useWeb3Api("getOpenPositionFee", selectedCurrency, purchaseFeePayload);

    const positionRewardsPayload = useMemo(() => ({ tokenAmount, account} ), [tokenAmount, account]);
    const positionRewards = useWeb3Api("calculatePositionReward", selectedCurrency, positionRewardsPayload);

    const currentFundingFeePayload = useMemo(() => ({account, tokenAmount}), [account, tokenAmount]);
    const currentFundingFee = useWeb3Api("getFundingFeePerTimePeriod", selectedCurrency, currentFundingFeePayload);

    const [isHighCollateralRatio, setIsHighCollateralRatio] = useState();

    useEffect(() => {
        if(purchaseFee === "N/A" || collateralRatioData === "N/A") return;
        if(collateralRatioData?.currentRatioValue && purchaseFee?.turbulence) {
            setIsHighCollateralRatio(toBN(purchaseFee?.turbulence).cmp(toBN(100)) > -1 || toBN(toBNAmount(collateralRatioData.collateralRatio.toString(), 8)).cmp(toBN(platformConfig.collateralRatios.buy.markedLevel, 8)) > 0);
        }
    }, [collateralRatioData, purchaseFee]);

    return useMemo(() => {
        const receiveAmount = purchaseFee === "N/A" ? "N/A" : purchaseFee && toDisplayAmount(tokenAmount.sub(toBN(purchaseFee?.openFee?.toString())), activeToken.decimals);
 
        return  (
            <> 
                <Stat 
                    name="collateralRatio" 
                    value={collateralRatioData?.collateralRatio} 
                    format={`${customFixedTokenValue(collateralRatioData?.collateralRatio, 0, 8)}%`}
                    className={`bold ${isHighCollateralRatio ? 'low' : 'high'}`} 
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
    
                <Stat 
                    title="Open position reward" 
                    value={positionRewards === "N/A" ? "N/A" : positionRewards?.toString()}
                    _suffix="GOVI"
                    format={customFixedTokenValue(positionRewards?.toString(), 8, activeToken.goviDecimals)}
                />
    
                <Stat 
                    title="Current funding fee" 
                    value={currentFundingFee === "N/A" ? "N/A" : currentFundingFee?.toString()} 
                    format={customFixedTokenValue(currentFundingFee?.toString(), activeToken.fixedDecimals, activeToken.decimals)}
                    _suffix={selectedCurrency}
                />
    
                <Stat title="CVI Index" value={cviInfo?.price} />
            </>
        )
    }, [collateralRatioData, cviInfo?.price, amount, leverage, purchaseFee, selectedCurrency, activeToken, tokenAmount, positionRewards, currentFundingFee]) 
   
}

const LiquidityView = ({amount, selectedCurrency}) => {
    const collateralRatioData = useWeb3Api("getCollateralRatio", selectedCurrency);
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    const activeToken = useActiveToken(selectedCurrency);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const lpTokenPayload = useMemo(() => ({tokenAmount}), [tokenAmount]);
    const lpTokenAmount = useWeb3Api("toLPTokens", selectedCurrency, lpTokenPayload)

    return useMemo(() => {

        return  <> 
           <Stat 
                name="collateralRatio" 
                value={collateralRatioData?.collateralRatio} 
                format={`${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0)}%`}
                className={`bold ${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0) >= 80 ? 'low' : 'high'}`} 
            />

            <Amount title="Deposit" amount={amount} selectedCurrency={selectedCurrency} />

            <Stat 
                className="bold" 
                title="You will receive" 
                value={lpTokenAmount} 
                format={customFixedTokenValue(lpTokenAmount, 6, activeToken.goviDecimals)}
                _suffix={`CVI-${selectedCurrency} LP`}
            />

            <Stat title="CVI Index" value={cviInfo?.price} />
        </>
    }, [collateralRatioData, amount, selectedCurrency, cviInfo?.price, lpTokenAmount, activeToken])
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