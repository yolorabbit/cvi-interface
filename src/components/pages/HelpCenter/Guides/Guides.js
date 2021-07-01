import React, { useMemo } from 'react'

const Guides = () => {
  return useMemo(() => {
    const onWhitepaperClick = () => {
        // track('Whitepaper');
        window.open('/files/cvi-white-paper.pdf');
    }

    const onUsdtAnnouncementClick = () => {
        // track('USDT Audit');
        window.open('/files/usdt-audit.pdf');
    }

    const onEthAnnouncementClick = () => {
        // track('ETH Audit');
        window.open('/files/eth-audit.pdf');
    }

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
          <Document title="Whitepaper" onClick={onWhitepaperClick} />
          <Document title="Volatility token" onClick={() => {}}  />
          <Document title="USDT Audit" date="January 6th, 2021" onClick={onUsdtAnnouncementClick}  />
          <Document title="ETH Audit" date="March 29th, 2021" onClick={onEthAnnouncementClick}  />
        </div>
      </div>
    )
  }, [])
}

const Document = ({title, date, onClick}) => {
  return (
    <div className="document-component" onClick={onClick}>
      <img src={require('../../../../images/icons/document.svg').default} alt="document" />
      <div className="document-component__content">
        <span>{title}</span>
        {date && <span>{date}</span>}
      </div>
    </div>
  )
}


export default Guides;