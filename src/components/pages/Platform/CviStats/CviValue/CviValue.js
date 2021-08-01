import { useIsMobile } from 'components/Hooks';
import Spinner from 'components/Spinner/Spinner';
import React from 'react'
import { useSelector } from 'react-redux';
import CviVol from '../CviVol';
import './CviValue.scss';

const CviValue = () => {
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    const isPositive = cviInfo?.lastTimeChange > 0;
    const isMobile = useIsMobile();

    return (
        <> 
            <div className="cvi-info-component">
                {cviInfo ? <> 
                    <div className="cvi-info-component__top border">
                        <span className="cvi-info-component__top--title">CVI</span>
                        <b className="cvi-info-component__top--value">{cviInfo?.price}</b>
                        <div className={`cvi-info-component__top--info ${isPositive ? 'high' : 'low'}`}>
                            <span>{cviInfo?.lastTimeChange}</span> 
                            <span>({`${isPositive ? '+' : ''}`}{cviInfo?.lastTimeChangePrecentage}%)</span>
                            <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" />
                        </div>
                    </div>

                    {!isMobile && <> 
                        <CviVol />
                        <div className="cvi-info-component__bottom">
                            <span>{cviInfo?.time}</span>
                        </div>
                    </>}
                
                </> : <> 
                    <div className="cvi-info-component__top"> <span className="cvi-info-component__top--title">CVI </span></div>
                    <div className="cvi-info-component__bottom"> <Spinner className="statistics-spinner"/></div>
                </>}
            </div>

            {isMobile && <div className="cvi-info-component__mobile-vol"> 
                <CviVol />
                <div className="cvi-info-component__bottom">
                    <span>{cviInfo?.time}</span>
                </div>
            </div>}
        </>
    )
}

export default CviValue;