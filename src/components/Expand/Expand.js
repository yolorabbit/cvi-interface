import Button from 'components/Elements/Button';
import React, { useState } from 'react';
import './Expand.scss';

const Expand = ({header, expandedView}) => {
    const [isExpanded, setIsExpanded] = useState();

    return (
        <div className={`expand-component ${isExpanded ? 'expanded' : ''}`}>
            <div className="expand-component__header">
                {header}
                <Button className="expand-component__header--button"  onClick={() => setIsExpanded(!isExpanded)}>
                    <img src={require('../../images/icons/dropdown-chevron.svg').default} alt="chevron" />
                </Button>
            </div>

            {isExpanded && <div className="expand-component__expanded">
                {expandedView}
            </div> }
        </div>
    )
}

export default Expand;