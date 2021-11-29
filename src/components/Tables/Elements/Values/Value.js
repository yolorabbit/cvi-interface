import React, { useMemo } from 'react'
import { DataState } from './DataState';
import { commaFormatted } from 'utils';
import Coin from './Coin';

const Value = ({className, text, header, subText, prefix, bottomText, protocol, format, progressBarPercents, coin, showData = true}) => {
    return useMemo(() => {
        return (
            <div className={`value-component ${className ?? ''}`}>
                {!showData ? <span>-</span> :
                    <>
                        {header && <h5>{header}</h5>} 
                        <DataState value={text === null ? null : text ?? subText}>
                            {coin && <Coin token={coin} />}
                            {prefix && <span>{prefix}</span>}
                            {text && <b>{progressBarPercents ? 
                                <span style={{width: `${progressBarPercents}%`}}>{commaFormatted(format) ?? text}</span> : 
                                commaFormatted(format) ?? text}
                            </b>}
                            <span>{(text && subText) ? <>&nbsp;{subText}</> : subText}</span>
                            {bottomText && <div>{bottomText} {protocol && protocol !== "platform" && <span className="value-component__protocol">{`(${protocol})`}</span>}</div>}
                        </DataState>
                    </>
                }
            </div>
        )
    }, [className, showData, header, text, subText, coin, prefix, progressBarPercents, format, bottomText, protocol]);
}

export default Value;