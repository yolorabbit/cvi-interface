import React from 'react'

const Coin = ({token}) => {
  if(!token) return null;
  return <img className="coin-component" src={require(`images/coins/${token}.svg`).default} alt={token} />
}

export default Coin;