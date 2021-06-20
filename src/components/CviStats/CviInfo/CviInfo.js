import React from 'react'
import './CviInfo.scss';

const CviInfo = () => {
    const isPositive = true;

    return (
        <div className="cvi-info-component">
            <div className="cvi-info-component__top">
                <span className="cvi-info-component__top--title">CVI</span>
                <b className="cvi-info-component__top--value">39.8</b>
                <div className={`cvi-info-component__top--info ${isPositive ? 'high' : 'low'}`}>
                    <span>4.4</span> 
                    <span>({`${isPositive ? '+' : '-'}`}1.67%)</span>
                    <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" />
                </div>
            </div>

            <div className="cvi-info-component__bottom">
                <span>{new Date().toLocaleString()}</span>
            </div>
        </div>
    )
}

export default CviInfo;