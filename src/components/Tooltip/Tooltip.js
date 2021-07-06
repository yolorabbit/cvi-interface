import { useIsDesktop } from 'components/Hooks';
import React, { useMemo } from 'react'
import './Tooltip.scss';

const Tooltip = ({type = "info", left, mobileLeft, right, maxWidth, minWidth, content, children}) => {
    const isDesktop = useIsDesktop();
    return useMemo(() => {
        return (
            <div className="tooltip">
                <div className="tooltip-avatar">
                {type === 'info' && <img src={require('../../images/icons/info.svg').default} alt="info" /> }
                {type === 'info-warning' && <img src={require('../../images/icons/info-warning.svg').default} alt="warning" /> }
                    {type === 'question' && <img src={require('../../images/icons/question-mark.svg').default} alt="question mark" /> }
                </div>
                <span className="tooltip__info" style={{
                    left: !isDesktop ? mobileLeft ?? left : left,
                    right,
                    maxWidth,
                    minWidth
                }}>
                    <div>
                        {content}
                        {children}
                    </div>
                </span>
            </div>
        )
        //eslint-disable-next-line
    }, [isDesktop]);
}

export default Tooltip;