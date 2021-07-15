import React, { useMemo } from 'react'
import { DataState } from './DataState';
import { commaFormatted } from 'utils';

const Value = ({text, subText, bottomText, format, showData = true}) => {
    return useMemo(() => {
        return (
            <div className="value-component">
                {!showData ? <span>-</span> :
                    <DataState value={text === null ? null : text ?? subText}>
                        <b>{commaFormatted(format) ?? text}</b>
                        <span>&nbsp;{subText}</span>
                        {bottomText && <div>{bottomText}</div>}
                    </DataState>
                }
            </div>
        )
    }, [text, subText, bottomText, format, showData]);
}

export default Value;