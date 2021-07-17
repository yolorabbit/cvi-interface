import { stakingProtocols } from 'config/stakingConfig';
import React from 'react'
import Coin from './Coin';
import Pairs from './Pairs';

const StakedAmount = ({token, protocol, StakedValue}) => {
  const [leftToken, rightToken] = token?.split('-');

  
  return <div className="staked-amount-component">
   {stakingProtocols[protocol] === stakingProtocols.platform ? 
      <Coin token={token} /> : 
      <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} hideNames />
    }
    {StakedValue}
  </div>
}

export default StakedAmount;