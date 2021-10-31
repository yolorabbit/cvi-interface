import Button from 'components/Elements/Button';
import React, { useState } from 'react';
import './Expand.scss';

const Expand = ({header, expandedView, classNames}) => {
    const [isExpanded, setIsExpanded] = useState();

    return (
        <div className={`expand-component ${isExpanded ? 'expanded' : ''} ${classNames ? classNames : ''}`}>
            <div className="expand-component__header" onClick={() => setIsExpanded(!isExpanded)}>
                {header}
                <Button className="expand-component__header--button" >
                    <img src={require('../../images/icons/dropdown-chevron-orange.svg').default} alt="chevron" />
                </Button>
            </div>

            {isExpanded && <div className="expand-component__expanded">
                {expandedView}
            </div> }
        </div>
    )
}

export default Expand;