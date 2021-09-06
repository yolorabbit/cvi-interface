import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './CviVol.scss';

const CviVol = () => {
   const { cviInfo } = useSelector(({ app }) => app.cviInfo);

   return useMemo(() => {
     if(!cviInfo) return null;
     const isPositive = cviInfo.ethVolOneDayChangePercent > 0;
      return (
         <div className="cvi-volatility-component">
            <div className="cvi-volatility-component__vol">
               <span className="cvi-volatility-component__vol--title">ETH Volatility (ETHVol)</span>
               <span className="cvi-volatility-component__vol--value">{cviInfo.ethVol}</span>
               <span className={`cvi-info-component__top--info cvi-volatility-component__vol--precent ${isPositive ? 'high' : 'low'}`}>
                  {cviInfo.ethVolOneDayChange} ({isPositive ? '+' : ''}{cviInfo.ethVolOneDayChangePercent}%) <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" />
               </span>
            </div>
         </div>
      );
   }, [cviInfo]);
};

export default CviVol;
