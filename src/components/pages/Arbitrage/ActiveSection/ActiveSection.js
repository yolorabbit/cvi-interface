import { appViewContext } from 'components/Context';
import Details from 'components/Details/Details';
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useW3SDK } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import Form from '../Form';
import GraphsThumbnail from '../GraphsThumbnail';
import './ActiveSection.scss';

const LONG_TOKEN = {
  ETHVOL_USDC_LONG: "ETHVOL-USDC-LONG"
}
const ActiveSection = ({activeTab}) => { 
    const { activeView } = useContext(appViewContext);
    const { selectedNetwork } = useSelector(({app}) => app);
    const [selectedCurrency, setSelectedCurrency] = useState();
    const [amount, setAmount] = useState("");
    
    const { account } = useActiveWeb3React();

    const w3 = useW3SDK({
      token: [LONG_TOKEN.ETHVOL_USDC_LONG]
    });

    useEffect(() => { // initial selected curreny
        if(!selectedNetwork || !activeView) return;
        const activeToken = Object.values(arbitrageConfig.tokens[selectedNetwork]).find(({view}) => view === activeView);
        if(!activeToken) return;
        setSelectedCurrency(activeToken.key);
    }, [activeView, selectedNetwork]);

    useEffect(() => {
        const start = async() => {
            console.log("w3: ", w3);
            console.log(`${LONG_TOKEN.ETHVOL_USDC_LONG}: `, w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG]);

            // show as time delay fee min and max.
            // const timeDelayWindow = await w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG].getTimeDelayWindow();
            // console.log('timeDelayWindow: ', timeDelayWindow); {min/60 , max/60}

            // calculate time delay fee 
            // const timeDelayFee = await w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG].calculateTimeDelayFee(1000)
            // console.log("timeDelayFee: ", timeDelayFee);
            
            // create mint request
            // const submitMintRes = await w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG].submitMint("10",account, 500);
            // console.log("submitMintRes: ", submitMintRes);

            // pending reqeusts -> store in reducer under mints
            // const unfulfilledRequests = await w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG].getUnfulfilledRequests({account});
            // console.log("unfulfilledRequests: ", unfulfilledRequests);
            
        }

        if(account && w3?.tokens) {
            start();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [w3?.tokens, account]);

    if(!selectedCurrency) return null;

    return (
        <div className="arbitrage-section-component">
            <Form 
                type={activeView} 
                amount={amount}
                setAmount={setAmount}
                selectedCurrency={selectedCurrency}
            />

            <Details 
                activeVolIndex={activeTab} 
                selectedCurrency={selectedCurrency}
                amount={amount}
            />

            <GraphsThumbnail />
        </div>
    )
}

export default ActiveSection;