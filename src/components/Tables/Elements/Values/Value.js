import React, { useMemo } from 'react'
import { DataState } from './DataState';
import { commaFormatted } from 'utils';
import Coin from './Coin';

const Value = ({className, text, subText, bottomText, protocol, format, progressBarPercents, coin, showData = true}) => {
    return useMemo(() => {
        return (
            <div className={`value-component ${className ?? ''}`}>
                {!showData ? <span>-</span> :
                    <DataState value={text === null ? null : text ?? subText}>
                        {coin && <Coin token={coin} />}
                        <b>{progressBarPercents ? 
                            <span style={{width: `${progressBarPercents}%`}}>{commaFormatted(format) ?? text}</span> : 
                            commaFormatted(format) ?? text}
                        </b>
                        <span>{(text && subText) ? <>&nbsp;{subText}</> : subText}</span>
                        {bottomText && <div>{bottomText} {protocol && protocol !== "platform" && <span className="value-component__protocol">{`(${protocol})`}</span>}</div>}
                    </DataState>
                }
            </div>
        )
    }, [className, text, subText, bottomText, protocol, format, showData, progressBarPercents, coin]);
}

export default Value;