import Tabs from 'components/Tabs';
import React from 'react';
import './SelectLeverage.scss';

const SelectLeverage = ({leverage, tokenLeverageList = [], setLeverage}) => {
    return (
        <div className="select-leverage-component">
           <h2>Select Leverage</h2>
           <Tabs type="leverage" suffix="x" tabs={tokenLeverageList} activeTab={leverage} setActiveTab={setLeverage} />
        </div>
    )
}

export default SelectLeverage;
