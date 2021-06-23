import Tabs from 'components/Tabs';
import React from 'react';
import './SelectLeverage.scss';

const SelectLeverage = ({leverage, setLeverage}) => {
    return (
        <div className="select-leverage-component">
           <h2>Select Leverage</h2>
           <Tabs type="leverage" tabs={["X1", "X2", "X3"]} activeTab={leverage} setActiveTab={setLeverage} />
        </div>
    )
}

export default SelectLeverage;
