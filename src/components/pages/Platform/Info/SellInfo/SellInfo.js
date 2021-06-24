import React from 'react'
import { useActionController } from '../../Actions/ActionController';
import './SellInfo.scss';

const SellInfo = () => {
    const { token, amount } = useActionController();

    return (
        <div className="sell-info-component">
            <div className="sell-info-component__row">
                <span>Sell amount</span>
                <span>{amount || "0"} {token?.toUpperCase()}</span>
            </div>

            <div className="sell-info-component__row">
                <span>Sell fee</span>
                <span>0.1 {token?.toUpperCase()}</span>
            </div>

            <div className="sell-info-component__row">
                <b>You receive</b>
                <b>3.9 {token?.toUpperCase()}</b>
            </div>
        </div>
    )
}

export default SellInfo;