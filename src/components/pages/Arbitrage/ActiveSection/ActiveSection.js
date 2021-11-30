import { appViewContext } from 'components/Context';
import Details from 'components/Details/Details';
import React, { useContext, useMemo, useState } from 'react'
import { useActiveToken } from 'components/Hooks';
import Form from '../Form';
import GraphsThumbnail from '../GraphsThumbnail';
import './ActiveSection.scss';
import config from 'config/config';

const ActiveSection = ({activeTab}) => { 
    const { activeView } = useContext(appViewContext);
    const activeToken = useActiveToken(activeView, config.routes.arbitrage.path);
    const [amount, setAmount] = useState("");
    
    return useMemo(() => {
        if(!activeToken?.name) return null;
        
        return (
            <div className="arbitrage-section-component">
                <Form
                    type={activeView}
                    amount={amount}
                    setAmount={setAmount}
                />

                <Details
                    activeVolIndex={activeTab}
                    amount={amount} 
                    path={config.routes.arbitrage.path}
                />

                <GraphsThumbnail />
            </div>
        );
    }, [activeTab, activeToken?.name, activeView, amount]);
}

export default ActiveSection;