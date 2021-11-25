import Details from 'components/Details/Details';
import React from 'react'
import './ActiveSection.scss';

const ActiveSection = ({activeTab}) => {
    return (
        <div className="arbitrage-section-component">
            <div>
                {activeTab}
            </div>
            <Details />
        </div>
    )
}

export default ActiveSection;