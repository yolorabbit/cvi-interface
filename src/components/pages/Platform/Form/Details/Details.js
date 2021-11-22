import { platformViewContext } from "components/Context";
import { useContext, useMemo} from "react";
import { customFixed, customFixedTokenValue, toBN, toBNAmount, toDisplayAmount } from "utils";
import Stat from "components/Stat";
import { useSelector } from "react-redux";
import { useWeb3Api } from "contracts/useWeb3Api";
import { useActiveToken, useActiveVolInfo } from '../../../../Hooks';
import { useActiveWeb3React } from "components/Hooks/wallet";
import { chainNames } from "connectors";
import config from "config/config";
import './Details.scss';

const Details = ({activeVolIndex, selectedCurrency, amount, leverage, slippageTolerance}) => {
    const { activeView } = useContext(platformViewContext);
 
    return useMemo(() => {
        return (
            <div className="platform-form-details-component">
                <div className="platform-form-details-component__container">
                    {activeView === "trade" ? <TradeView 
                        amount={amount} 
                        selectedCurrency={selectedCurrency} 
                        leverage={leverage}
                        activeVolIndex={activeVolIndex}
                        slippageTolerance={slippageTolerance}
                    /> : <LiquidityView 
                            amount={amount} 
                            selectedCurrency={selectedCurrency} 
                            activeVolIndex={activeVolIndex}
                        />}
                </div>
            </div>
        )
    }, [activeVolIndex, selectedCurrency, activeView, amount, leverage, slippageTolerance]); 
}

const TradeView = ({amount, leverage, selectedCurrency, activeVolIndex, slippageTolerance}) => {
    const activeVolInfo = useActiveVolInfo(activeVolIndex);
    const { selectedNetwork } = useSelector(({app}) => app);
    const { account } = useActiveWeb3React();
    const activeToken = useActiveToken(selectedCurrency);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const [collateralRatioData] = useWeb3Api("getCollateralRatio", selectedCurrency);
    const purchaseFeePayload = useMemo(() => ({ tokenAmount, leverage } ), [tokenAmount, leverage]);
    
    const [purchaseFee] = useWeb3Api("getOpenPositionFee", selectedCurrency, purchaseFeePayload, { validAmount: true });
    
    const positionRewardsPayload = useMemo(() => ({ tokenAmount, account, leverage} ), [leverage, tokenAmount, account]);
    const [positionRewards] = useWeb3Api("calculatePositionReward", selectedCurrency, positionRewardsPayload, { validAmount: true });
    
    const currentFundingFeePayload = useMemo(() => ({account, tokenAmount, leverage, purchaseFee}), [account, leverage, tokenAmount, purchaseFee]);
    const [currentFundingFee] = useWeb3Api("getFundingFeePerTimePeriod", selectedCurrency, currentFundingFeePayload, { validAmount: true });
    const actLowRules = !(activeToken.key === "usdt" && selectedNetwork === chainNames.Ethereum);
    
    
    return useMemo(() => {
        const tokenName = activeToken?.name?.toUpperCase();
        const receiveAmount = purchaseFee === "N/A" ? "N/A" : purchaseFee && toDisplayAmount(tokenAmount.sub(toBN(purchaseFee?.openFee?.toString())), activeToken.decimals);

        return  (
            <> 
                <Stat 
                    className="bold amount"
                    title="Buy amount" 
                    value={!amount ? "0" : amount} 
                    _suffix={tokenName} 
                />

                {leverage && <Stat className="large-value" title="Leverage" value={leverage} prefix="x" /> }
        
                <Stat 
                    name="purchaseFee"
                    actLowRules={actLowRules}
                    value={purchaseFee === "N/A" || purchaseFee === "0" ? purchaseFee : purchaseFee?.openFee?.toString()} 
                    _suffix={tokenName}
                    className="large-value"
                    format={toDisplayAmount(purchaseFee === "0" ? "0" : purchaseFee?.openFee?.toString(), activeToken.decimals)}
                    actEthvol={activeVolIndex === config.volatilityKey.ethvi}
                />

                <Stat 
                    className="large-value"
                    title="Position value" 
                    value={receiveAmount === "N/A" ? "N/A" : receiveAmount} 
                    _suffix={tokenName} 
                />

                <Stat 
                    className="large-value"
                    name="openPositionReward" 
                    value={positionRewards === "N/A" ? "N/A" : positionRewards?.toString()}
                    _suffix="GOVI"
                    format={`${customFixedTokenValue(positionRewards?.[0]?.toString() ?? 0, 8, activeToken.lpTokensDecimals)} ${positionRewards !== "N/A" ? '-' :''} ${customFixedTokenValue(positionRewards?.[1]?.toString() ?? 0, 8, activeToken.lpTokensDecimals)}`}
                />
    
                <Stat 
                    className="low-priority low-priority--header large-value"
                    name="collateralRatio" 
                    value={collateralRatioData === "N/A" ? "N/A" : collateralRatioData?.collateralRatio} 
                    format={`${customFixedTokenValue(collateralRatioData?.collateralRatio, 0, 8)}%`}
                    actEthvol={activeVolIndex === config.volatilityKey.ethvi}
                />
    
                <Stat 
                    className="low-priority large-value"
                    name="fundingFee"
                    value={currentFundingFee === "N/A" ? "N/A" : currentFundingFee?.toString()} 
                    format={currentFundingFee === "N/A" ? "N/A" : customFixed(customFixedTokenValue(currentFundingFee?.toString() === "0" ? "0" : currentFundingFee?.div(toBN("24"))?.toString(), activeToken.decimals, activeToken.decimals), activeToken.fixedDecimals)}
                    _suffix={tokenName}
                    actEthvol={activeVolIndex === config.volatilityKey.ethvi}
                />
                
                <Stat 
                    className="low-priority large-value"
                    title={`${activeVolIndex?.toUpperCase()} index`} 
                    value={activeVolInfo?.index} 
                />

                {(activeToken.type === "v3" || activeToken.type === "usdc") && <Stat 
                    className="low-priority large-value"
                    title={config.statisticsDetails.slippageTolerance.title} 
                    value={slippageTolerance || "0"} 
                    format={`${slippageTolerance || "0"}%`}
                />}
            </>
        )
    }, [activeToken?.name, activeToken.decimals, activeToken.lpTokensDecimals, activeToken.fixedDecimals, activeToken.type, purchaseFee, tokenAmount, amount, leverage, actLowRules, activeVolIndex, positionRewards, collateralRatioData, currentFundingFee, activeVolInfo?.index, slippageTolerance]) 
   
}

const LiquidityView = ({amount, selectedCurrency, activeVolIndex}) => {
    const [collateralRatioData] = useWeb3Api("getCollateralRatio", selectedCurrency);
    const activeVolInfo = useActiveVolInfo(activeVolIndex);
    const activeToken = useActiveToken(selectedCurrency);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const lpTokenPayload = useMemo(() => ({tokenAmount}), [tokenAmount]);
    const [lpTokenAmount] = useWeb3Api("toLPTokens", selectedCurrency, lpTokenPayload, { validAmount: true })

    return useMemo(() => {
        const tokenName = activeToken?.name?.toUpperCase();

        return  <> 
            <Stat 
                className="bold amount"
                title="Deposit amount" 
                value={!amount ? "0" : amount} 
                _suffix={tokenName} 
            />

            <Stat 
                className="large-value" 
                title="You will receive" 
                value={activeVolInfo?.key && lpTokenAmount} 
                format={customFixedTokenValue(lpTokenAmount, 6, activeToken.lpTokensDecimals)}
                _suffix={`${activeVolInfo?.key?.toUpperCase()}-${tokenName} LP`}
            />

           <Stat 
                className="low-priority low-priority--header"
                name="collateralRatio" 
                value={collateralRatioData?.collateralRatio} 
                format={`${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0)}%`}
                actEthvol={activeVolIndex === config.volatilityKey.ethvi}
            />

            <Stat 
                className="low-priority"
                title={`${activeVolIndex?.toUpperCase()} index`}  
                value={activeVolInfo?.index} 
            />
        </>
    }, [activeToken?.name, activeToken.lpTokensDecimals, amount, activeVolInfo?.key, activeVolInfo?.index, lpTokenAmount, collateralRatioData?.collateralRatio, activeVolIndex])
}

export default Details;