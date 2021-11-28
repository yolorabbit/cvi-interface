import { appViewContext } from 'components/Context';
import Details from 'components/Details/Details';
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux';
import Form from '../Form';
import GraphsThumbnail from '../GraphsThumbnail';
import './ActiveSection.scss';

const ActiveSection = ({activeTab}) => { 
    const { activeView } = useContext(appViewContext);
    const { selectedNetwork } = useSelector(({app}) => app);
    const [selectedCurrency] = useState(arbitrageConfig.tokens[selectedNetwork]?.['usdc-ethvi'].key);
    const [amount, setAmount] = useState("");
    
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