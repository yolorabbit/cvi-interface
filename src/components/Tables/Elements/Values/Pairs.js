import React from 'react'
import Coin from './Coin';

const Pairs = ({leftToken, rightToken, protocol}) => {
  return <div className="pairs-component">
      <div className="pairs-component__coins">
        <Coin token={leftToken}  />
        <Coin token={rightToken} />
      </div>

      {protocol && <div className="pairs-component__group">
          <img src={require(`images/protocols/${protocol}.svg`).default} alt={protocol} />
          <div className="pairs-component__group--protocol">
            <span>{leftToken}-{rightToken} LP</span>
            <span>{protocol}</span>
          </div>
      </div> }
  </div>
}

export default Pairs;