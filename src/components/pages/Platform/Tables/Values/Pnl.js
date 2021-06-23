import React from 'react'

const Pnl = ({value, token, precents}) => {
    const isPositive = precents >= 0;

    return (
        <div className={`pnl-component ${isPositive ? 'high' : 'low'}`}>
            <b>{value} </b>
            <span className="pnl-component__token">{token} </span>
            <span className="pnl-component__precents">{`(${!isPositive ? '-' : ''}${precents}%)`} <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" /></span>
        </div>
    )
}

export default Pnl;