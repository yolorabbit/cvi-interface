import React, { useState } from 'react';
import './Expand.scss';

const Expand = ({header, expandedView}) => {
    const [isExpanded, setIsExpanded] = useState();

    return (
        <div className={`expand-component ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
            <div className="expand-component__header">
                {header}
                <img src={require('../../images/icons/dropdown-chevron.svg').default} alt="chevron" />
            </div>

            {isExpanded && <div className="expand-component__expanded">
                {expandedView}
            </div> }
        </div>
    )
}

export default Expand;