import AddMetamaskAsset from 'components/AddMetamaskAsset/AddMetamaskAsset';
import { stakingProtocols } from 'config/stakingConfig';
import React from 'react'

const Coin = ({token, showName, protocol}) => {
  if(!token) return null;
  const tokenKey = (token === 'govi-v1' || token === 'govi-v2') ? 'govi' : token;
  const tokenName = tokenKey.split('-').length > 1 ? tokenKey.replace(/-([^-]*)$/, ' $1') : tokenKey;

return <> 
    <img className="coin-component--img" src={require(`images/coins/${tokenKey}.svg`).default} alt={tokenKey} />
    {showName && <span className="coin-component--text">{tokenName.toUpperCase()}</span>}
    {protocol === stakingProtocols.platform && <AddMetamaskAsset token={token} protocol={protocol} /> }
  </>
}

export default Coin;