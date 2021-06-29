import { platformViewContext } from "components/Context";
import { useContext, useMemo } from "react";
import { commaFormatted } from "utils";
import Stat from "components/Stat";
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
    return (
        <> 
            <Stat name="collateralRatio" value="85%" className="bold low" />

            <Stat className="bold" title="Leverage" value={leverage} />

            <Amount title="Buy" amount={amount} selectedCurrency={selectedCurrency} />

            <Stat title="Purchase fee" value={`0.10007213 ${selectedCurrency}`} className="low" />

            <Stat className="bold green" title="Your position" value={`3.93287142 ${selectedCurrency}`} />

            <Stat title="Open position reward" value="100 GOVI" />

            <Stat title="Current funding fee" value={`0.01 ${selectedCurrency}`} />

            <Stat title="CVI Index" value="39.8" />
        </>
    )
}

const LiquidityView = ({amount, selectedCurrency}) => {
    return useMemo(() => {
        return  <> 
            <Stat name="collateralRatio" value="65%" />

            <Amount title="Deposit" amount={amount} selectedCurrency={selectedCurrency} />

            <Stat className="bold" title="You will receive" value={`0.4 CVI-${selectedCurrency}-LP`} />

            <Stat title="CVI Index" value="39.8" />
        </>
    }, [amount, selectedCurrency])
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