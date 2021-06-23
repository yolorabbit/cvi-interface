import React from 'react'

const Coin = ({token}) => {
  return <img className="coin-component" src={require(`../../../../../images/coins/${token}.svg`).default} alt={token} />
}

export default Coin;