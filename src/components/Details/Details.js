import { appViewContext } from "components/Context";
import { activeViews as platformActiveViews } from "config/platformConfig";
import { activeTabs as arbitrageActiveViews } from "config/arbitrageConfig";
import { lazy, Suspense, useCallback, useContext, useMemo } from "react";
import './Details.scss';
import MintView from "./Views/MintView";
import BurnView from "./Views/BurnView";

const LiquidityView = lazy(() => import('./Views/LiquidityView'));
const TradeView = lazy(() => import('./Views/TradeView'));

const Details = ({activeVolIndex, selectedCurrency, amount, leverage, slippageTolerance}) => {
    const { activeView } = useContext(appViewContext);
   
    const getActiveView = useCallback(() => {
        switch(activeView) {
            case platformActiveViews.trade:
                return <TradeView 
                    amount={amount} 
                    selectedCurrency={selectedCurrency} 
                    leverage={leverage}
                    activeVolIndex={activeVolIndex}
                    slippageTolerance={slippageTolerance}
                />

            case platformActiveViews["view-liquidity"]:
                return <LiquidityView 
                    amount={amount} 
                    selectedCurrency={selectedCurrency} 
                    activeVolIndex={activeVolIndex}
                />

            case arbitrageActiveViews.mint: 
                return <MintView 
                    amount={amount} 
                    selectedCurrency={selectedCurrency} 
                    activeVolIndex={activeVolIndex}
                />

            case arbitrageActiveViews.burn: 
                return <BurnView 
                    amount={amount} 
                    selectedCurrency={selectedCurrency} 
                    activeVolIndex={activeVolIndex}
                />

            default:
                return null; 
        }
    }, [activeView, activeVolIndex, amount, leverage, selectedCurrency, slippageTolerance]);

    return useMemo(() => {
        return (
            <div className="details-component">
                <div className="details-component__container">
                    <Suspense fallback={<></>}>
                        {getActiveView()}
                    </Suspense>
                </div>
            </div>
        )
    }, [getActiveView]); 
}

export default Details;