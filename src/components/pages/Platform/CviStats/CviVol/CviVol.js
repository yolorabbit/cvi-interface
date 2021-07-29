import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './CviVol.scss';

const CviVol = () => {
   const { ethVolatilityInfo } = useSelector(({ app }) => app.cviInfo);

   return useMemo(() => {
     if(!ethVolatilityInfo) return null;
     const isPositive = ethVolatilityInfo.lastTimeChange > 0;
      return (
         <div className="cvi-volatility-component">
            <div className="cvi-volatility-component__vol">
               <span className="cvi-volatility-component__vol--title">ETH Volatility (ETHVol)</span>
               <span className="cvi-volatility-component__vol--value">{ethVolatilityInfo.price}</span>
               <span className={`cvi-info-component__top--info cvi-volatility-component__vol--precent ${isPositive ? 'high' : 'low'}`}>
                  {ethVolatilityInfo.lastTimeChange} ({isPositive ? '+' : ''}{ethVolatilityInfo.lastTimeChangePrecentage}%) <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" />
               </span>
            </div>
         </div>
      );
   }, [ethVolatilityInfo]);
};

export default CviVol;
