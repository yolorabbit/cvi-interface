import React from 'react'
import './ActiveSection.scss';

const ActiveSection = ({activeTab}) => {
    return (
        <div className="arbitrage-section-component">
            {activeTab}
        </div>
    )
}

export default ActiveSection;