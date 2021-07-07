import { platformViewContext } from "components/Context";
import { useContext, useMemo } from "react";
import { commaFormatted, customFixed, toBN, toDisplayAmount } from "utils";
import Stat from "components/Stat";
import { useSelector } from "react-redux";
import { useWeb3Api } from "contracts/useWeb3Api";
import './Details.scss';

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
    console.log(amount);
    const collateralRatioData = useWeb3Api("getCollateralRatio", selectedCurrency);
    const body = useMemo(() => {
        return {
            amount: toBN(amount)
        }
    }, [amount])

    const purchaseFee = useWeb3Api("getOpenPositionFee", selectedCurrency, body);

    console.log(purchaseFee);

    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    return useMemo(() => {

        return  (
            <> 
                <Stat 
                    name="collateralRatio" 
                    value={collateralRatioData?.collateralRatio} 
                    format={`${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0)}%`}
                    className={`bold ${customFixed(toDisplayAmount(collateralRatioData?.collateralRatio, 8), 0) >= 80 ? 'low' : 'high'}`} 
                />
        
                {leverage && <Stat className="bold" title="Leverage" value={leverage} /> }
    
                <Amount title="Buy" amount={amount} selectedCurrency={selectedCurrency} />
    
                <Stat title="Purchase fee" value={`0.10007213 ${selectedCurrency}`} className="low" />
    
                <Stat className="bold green" title="Your position" value={`3.93287142 ${selectedCurrency}`} />
    
                <Stat title="Open position reward" value="100 GOVI" />
    
                <Stat title="Current funding fee" value={`0.01 ${selectedCurrency}`} />
    
                <Stat title="CVI Index" value={cviInfo?.price} />
            </>
        )
    }, [collateralRatioData, cviInfo?.price, amount, leverage, selectedCurrency]) 
   
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