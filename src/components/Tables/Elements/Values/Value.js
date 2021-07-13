import React, { useMemo } from 'react'
import { DataState } from './DataState';

const Value = ({text, subText, bottomText, format}) => {
    return useMemo(() => {
        return (
            <div className="value-component">
                <DataState value={text === null ? null : text ?? subText}>
                    <b>{format ?? text} </b>
                    <span>{subText}</span>
                    {bottomText && <div>{bottomText}</div>}
                </DataState>
            </div>
        )
    }, [text, subText, bottomText, format]);
}

export default Value;