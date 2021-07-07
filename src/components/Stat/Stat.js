import Spinner from 'components/Spinner/Spinner';
import Tooltip from 'components/Tooltip';
import config from 'config/config';
import React from 'react'
import { commaFormatted } from 'utils';
import './Stat.scss';

const Stat = ({name, hideTooltip, prefix = "", title, format, className, formats, value, values, hideNa }) => {
    const { prefix: _prefix = prefix, suffix = "", title: configTitle = "", className: _className, tooltip: { left, content, mobileLeft} = {} } = config?.statisticsDetails?.[name] ?? {};
 
    return (
        <div className={`stat-component ${className ?? ''} ${_className ?? ''} ${values !== "N/A" && values?.length > 0 ? 'multiline' : ''}`}>
            <h2>{title ?? configTitle} {!hideTooltip && content && <Tooltip type="question" left={left ?? -30} mobileLeft={mobileLeft} maxWidth={400} minWidth={250} content={content} /> }</h2>
            {values === "N/A" ? <p>N/A</p> : values?.length > 0 && values.map((item, i) => item ? 
               item.defaultValue ? <p key={i}>{item.defaultValue}</p> :
                <p key={i}>{item !== "N/A" && !suffix && _prefix}{item === "N/A" ? !hideNa && item : formats?.[i] ? commaFormatted(formats[i]) : commaFormatted(item)} {item !== "N/A" && suffix}</p> 
                : 
                <Spinner key={i} className="statistics-spinner" />
            )}

            {value ? 
                <p>{value !== "N/A" && !suffix && _prefix}{value === "N/A" ? value : format ? commaFormatted(format) : commaFormatted(value)} {value !== "N/A" && suffix}</p> 
                : !values?.length > 0 && <Spinner className="statistics-spinner" />
            }
        </div>
    )
}

export default Stat;
