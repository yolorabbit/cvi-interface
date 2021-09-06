import { useIsMobile } from 'components/Hooks';
import Spinner from 'components/Spinner/Spinner';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import CviVol from '../CviVol';
import './CviValue.scss';

const CviValue = ({type}) => {
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    const isPositive = cviInfo?.lastTimeChange > 0;
    const isMobile = useIsMobile();

    return (
        <> 
            <div className="cvi-info-component">
                {cviInfo ? <> 
                    <div className="cvi-info-component__top border">
                        <span className="cvi-info-component__top--title">
                            <CviTitle type={type}/>
                        </span>
                        <b className="cvi-info-component__top--value">{cviInfo?.price}</b>
                        <div className={`cvi-info-component__top--info ${isPositive ? 'high' : 'low'}`}>
                            <span>{cviInfo?.lastTimeChange}</span> 
                            <span>({`${isPositive ? '+' : ''}`}{cviInfo?.lastTimeChangePrecentage}%)</span>
                            <img src={require(`images/icons/${isPositive ? 'up-arrow' : 'down-arrow'}.svg`).default} alt="arrow" />
                        </div>
                    </div>

                    {!isMobile && type !== 'home' && <> 
                        <CviVol />
                        <div className="cvi-info-component__bottom">
                            <span>{cviInfo?.time}</span>
                        </div>
                    </>}
                
                </> : <> 
                    <div className="cvi-info-component__top"> <span className="cvi-info-component__top--title"><CviTitle type={type}/> </span></div>
                    <div className="cvi-info-component__bottom"> <Spinner className="statistics-spinner"/></div>
                </>}
            </div>

            {isMobile && type !== 'home' && <div className="cvi-info-component__mobile-vol"> 
                <CviVol />
                <div className="cvi-info-component__bottom">
                    <span>{cviInfo?.time}</span>
                </div>
            </div>}
        </>
    )
}

const CviTitle = ({type}) => {
    return useMemo(() => {
        return type === "home" ? <span className="cvi-info-component--cvi-title stat-component"><h2>Index</h2>CVI</span> : "CVI"
    }, [type]);
}

export default CviValue;