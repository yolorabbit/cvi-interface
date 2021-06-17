import Spinner from 'components/Spinner/Spinner';
import Tooltip from 'components/Tooltip';
import config from 'config/config';
import React from 'react'
import { commaFormatted } from 'utils';
import './Stat.scss';

const Stat = ({name, hideTooltip, title, format, formats, value, values, hideNa }) => {
    const { prefix = "$", suffix = "", title: configTitle = "", className, tooltip: { left, content, mobileLeft} = {} } = config?.statisticsDetails?.[name] ?? {};
    const spinnerStyle = {
        style: {width: "auto", minHeight: "unset", padding: "12px 5px" },
        spinnerStyle: {fontSize: '2px', width: '3px', height: '3px'}
    }

    return (
        <div className={`stat-component ${className ?? ''} ${values?.length > 0 ? 'multiline' : ''}`}>
            <h2>{title ?? configTitle} {!hideTooltip && content && <Tooltip type="question" left={left ?? -30} mobileLeft={mobileLeft} maxWidth={400} minWidth={250} content={content} /> }</h2>
            {values?.length > 0 && values.map((item, i) => item ? 
               item.defaultValue ? <p key={i}>{item.defaultValue}</p> :
                <p key={i}>{item !== "N/A" && !suffix && prefix}{item === "N/A" ? !hideNa && item : formats?.[i] ? commaFormatted(formats[i]) : commaFormatted(item)} {item !== "N/A" && suffix}</p> 
                : 
                <Spinner key={i} className="spinner" {...spinnerStyle} />
            )}

            {value ? 
                <p>{value !== "N/A" && !suffix && prefix}{value === "N/A" ? value : format ? commaFormatted(format) : commaFormatted(value)} {value !== "N/A" && suffix}</p> 
                : !values?.length > 0 && <Spinner className="spinner" {...spinnerStyle} />
            }
        </div>
    )
}

export default Stat;
