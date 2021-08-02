import React from 'react'
import Coin from './Coin';

const Pairs = ({leftToken, rightToken, label, protocol, showImage, hideNames, poolLink}) => {
  return <div className="pairs-component">
      <div className="pairs-component__coins">
        <Coin token={leftToken}  />
        <Coin token={rightToken} />
      </div>

      {protocol && <div className="pairs-component__group">
          {showImage && <img src={require(`images/protocols/${protocol}.svg`).default} alt={protocol} /> }
          {!hideNames && <div className="pairs-component__group--protocol">
            <span>{label ?? `${leftToken?.toUpperCase()}-${rightToken?.toUpperCase()} LP`}</span>
            <span>{protocol}</span>
          </div>}
          {poolLink && <a className="external-link" href={poolLink} target="_blank" rel="noopener noreferrer">
            <img src={require('images/icons/pop.svg').default} alt="link"/>
          </a> }
      </div> }
  </div>
}

export default Pairs;