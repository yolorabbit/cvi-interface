import React, { useMemo } from 'react'

const Guides = () => {
  return useMemo(() => {
    return (
      <div className="guides-component">
        <h2>Guides</h2>
  
        <div className="guides-component__guide">
        <img src={require('../../../../images/icons/guide.svg').default} alt="guide" />
          <div className="guides-component__guide--body">
            <h3>Crypto Volatility Index Manual</h3>
            <p>We’ve prepared this tutorial to help you better understand the CVI features and trading options</p>
          </div>
        </div>
  
        <h2>Documents & Audits</h2>

        <div className="documents-component">
          <Document title="Whitepaper" />
          <Document title="Volatility token" />
          <Document title="USDT Audit" date="January 6th, 2021" />
          <Document title="ETH Audit" date="March 29th, 2021" />
        </div>
      </div>
    )
  }, [])
}

const Document = ({title, date}) => {
  return (
    <div className="document-component">
      <img src={require('../../../../images/icons/document.svg').default} alt="document" />
      <div className="document-component__content">
        <span>{title}</span>
        {date && <span>{date}</span>}
      </div>
    </div>
  )
}


export default Guides;