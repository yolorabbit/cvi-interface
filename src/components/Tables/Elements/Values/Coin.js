import AddMetamaskAsset from 'components/AddMetamaskAsset/AddMetamaskAsset';
import { stakingProtocols } from 'config/stakingConfig';
import React from 'react'

const Coin = ({token, showName, protocol}) => {
  if(!token) return null;

  const tokenName = token.split('-').length > 1 ? token.replace(/-([^-]*)$/, ' $1') : token;

return <> 
    <img className="coin-component--img" src={require(`images/coins/${token}.svg`).default} alt={token} />
    {showName && <span className="coin-component--text">{tokenName.toUpperCase()}</span>}
    {protocol === stakingProtocols.platform && <AddMetamaskAsset token={token} protocol={protocol} /> }
  </>
}

export default Coin;