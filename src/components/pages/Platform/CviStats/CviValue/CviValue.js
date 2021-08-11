import { useIsMobile } from 'components/Hooks';
import Spinner from 'components/Spinner/Spinner';
import moment from 'moment';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import CviVol from '../CviVol';
import './CviValue.scss';

const CviValue = ({type}) => {
    const { cviInfo } = useSelector(({app}) => app.cviInfo);
    const isPositive = cviInfo?.oneDayChangePercent > 0;
    const isMobile = useIsMobile();
    const cviDate = useMemo(() => cviInfo ? moment.utc(cviInfo?.timestamp * 1000).format('LLL') : cviInfo, [cviInfo])

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
                            <span>{cviInfo?.oneDayChange}</span> 
                            <span>({`${isPositive ? '+' : ''}`}{cviInfo?.oneDayChangePercent}%)</span>
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
                {!isMobile && <CviDateView cviDate={cviDate} /> }
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

const CviDateView = ({cviDate}) => {
    const isMobile = useIsMobile();
    return useMemo(() => {
        return <div className={isMobile ? "cvi-info-component__mobile-vol" : ''}> 
            <CviVol />
            <div className="cvi-info-component__bottom">
                <span>{cviDate}</span>
            </div>
        </div>
    }, [cviDate, isMobile]);
}

export default CviValue;