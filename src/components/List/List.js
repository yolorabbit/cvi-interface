import React from 'react';
import Expand from 'components/Expand';
import './List.scss';

const List = () => {
    return (
        <div className="list-component">
            <Expand>
                <span>8.45637366 ETH (0.03%)</span>
            </Expand>

            <Expand>
                <span>8.45637366 ETH (0.03%)</span>
            </Expand>
        </div>
    )
}

export default List;