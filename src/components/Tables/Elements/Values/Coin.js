import React from 'react'

const Coin = ({token, showName}) => {
  if(!token) return null;

  const tokenName = token.split('-').length > 1 ? token.replace(/-([^-]*)$/, ' $1') : token;
 
  return <> 
    <img className="coin-component--img" src={require(`images/coins/${token}.svg`).default} alt={token} />
    {showName && <span className="coin-component--text">{tokenName.toUpperCase()}</span>}
  </>
}

export default Coin;