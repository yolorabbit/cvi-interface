import React from 'react'

const Coin = ({token, showName}) => {
  if(!token) return null;
  return <> 
    <img className="coin-component--img" src={require(`images/coins/${token}.svg`).default} alt={token} />
    {showName && <span className="coin-component--text">{token.toUpperCase()}</span>}
  </>
}

export default Coin;