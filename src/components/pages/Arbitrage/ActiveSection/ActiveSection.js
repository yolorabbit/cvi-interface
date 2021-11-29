import { appViewContext } from 'components/Context';
import Details from 'components/Details/Details';
import React, { useContext, useEffect, useState } from 'react'
import { useActiveToken } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import Form from '../Form';
import GraphsThumbnail from '../GraphsThumbnail';
import './ActiveSection.scss';

const ActiveSection = ({activeTab}) => { 
    const { activeView, w3 } = useContext(appViewContext);
    const activeToken = useActiveToken(activeTab);
    const [amount, setAmount] = useState("");
    const { account } = useActiveWeb3React();

    useEffect(() => {
        const start = async() => {
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
    }, [w3?.tokens, account, w3, activeToken?.name]);

    if(!activeToken?.name) return null;

    return (
        <div className="arbitrage-section-component">
            <Form 
                type={activeView} 
                amount={amount}
                setAmount={setAmount}
                selectedCurrency={activeToken.name}
            />

            <Details 
                activeVolIndex={activeTab} 
                selectedCurrency={activeToken.name}
                amount={amount}
            />

            <GraphsThumbnail />
        </div>
    )
}

export default ActiveSection;