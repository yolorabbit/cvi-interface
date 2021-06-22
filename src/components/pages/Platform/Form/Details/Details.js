import { platformViewContext } from "components/Context";
import { useContext, useMemo } from "react";
import { commaFormatted } from "utils";
import Stat from "components/Stat";
import './Details.scss';

const Details = ({selectedCurrency, amount}) => {
    const { activeView } = useContext(platformViewContext);
 
    return useMemo(() => {
        return (
            <div className="platform-form-details-component">
                <div className="platform-form-details-component__container">
                    {activeView === "trade" ? <TradeView 
                        amount={amount} 
                        selectedCurrency={selectedCurrency} 
                    /> : <LiquidityView 
                            amount={amount} 
                            selectedCurrency={selectedCurrency} 
                        />}
                </div>
            </div>
        )
    }, [selectedCurrency, activeView, amount]); 
}

const TradeView = ({amount, selectedCurrency}) => {
    return (
        <> 
            <Stat className="bold" title="Collateral ratio" value="65%" />

            <Stat className="bold" title="Leverage" value="X2" />

            <Amount title="Buy" amount={amount} selectedCurrency={selectedCurrency} />

            <Stat title="Purchase fee" value={`0.10007213 ${selectedCurrency}`} />

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
            <Stat className="bold" title="Collateral ratio" value="65%" />

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