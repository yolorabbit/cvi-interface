import './CviVol.scss';

const CviVol = () => {
  const isPositive = true;
  return (
      <div className="cvi-volatility-component">
        <div className="cvi-volatility-component__vol">
            <span className="cvi-volatility-component__vol--title">ETH Volatility (ETHVol)</span> 
            <span className="cvi-volatility-component__vol--value">38.67</span>
            <span className={`cvi-info-component__top--info cvi-volatility-component__vol--precent ${isPositive ? 'high' : 'low'}`}>1.3 (-0.89%) <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" /></span>
         </div>
      </div>
   );
};

export default CviVol;