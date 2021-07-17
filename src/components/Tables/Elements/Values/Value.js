import React, { useMemo } from 'react'
import { DataState } from './DataState';
import { commaFormatted } from 'utils';

const Value = ({text, subText, bottomText, protocol, format, showData = true}) => {
    return useMemo(() => {
        return (
            <div className="value-component">
                {!showData ? <span>-</span> :
                    <DataState value={text === null ? null : text ?? subText}>
                        <b>{commaFormatted(format) ?? text}</b>
                        <span>&nbsp;{subText}</span>
                        {bottomText && <div>{bottomText} {protocol && protocol !== "platform" && <span className="value-component__protocol">{`(${protocol})`}</span>}</div>}
                    </DataState>
                }
            </div>
        )
    }, [text, subText, bottomText, protocol, format, showData]);
}

export default Value;