import Details from 'components/Details/Details';
import React from 'react'
import Form from '../Form';
import GraphsThumbnail from '../GraphsThumbnail';
import './ActiveSection.scss';

const ActiveSection = ({activeTab}) => { 
    return (
        <div className="arbitrage-section-component">
            <Form activeTab={activeTab} />
            <Details />
            <GraphsThumbnail />
        </div>
    )
}

export default ActiveSection;