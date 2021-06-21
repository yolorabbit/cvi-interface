import Tabs from 'components/Tabs';
import React, { useState } from 'react';
import './SelectLeverage.scss';


const SelectLeverage = () => {
    const [activeTab, setActiveTab] = useState("X1");

    return (
        <div className="select-leverage-component">
           <h2>Select Leverage</h2>

           <Tabs type="leverage" tabs={["X1", "X2", "X3"]} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

export default SelectLeverage;
