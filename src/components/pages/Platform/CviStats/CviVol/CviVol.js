import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './CviVol.scss';

const CviVol = () => {
   const { ethVolInfo } = useSelector(({ app }) => app.cviInfo);

   return useMemo(() => {
     if(!ethVolInfo) return null;
     const isPositive = ethVolInfo.ethVolOneDayChangePercent > 0;
      return (
         <div className="cvi-volatility-component">
            <div className="cvi-volatility-component__vol">
               <span className="cvi-volatility-component__vol--title">ETH Volatility (ETHVol)</span>
               <span className="cvi-volatility-component__vol--value">{ethVolInfo.ethvol}</span>
               <span className={`cvi-info-component__top--info cvi-volatility-component__vol--precent ${isPositive ? 'high' : 'low'}`}>
                  {ethVolInfo.ethvolOneDayChange} ({isPositive ? '+' : ''}{ethVolInfo.ethvolOneDayChangePercent}%) <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" />
               </span>
            </div>
         </div>
      );
   }, [ethVolInfo]);
};

export default CviVol;
