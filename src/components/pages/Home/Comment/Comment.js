import React, { useMemo } from 'react';
import './Comment.scss';

const Comment = ({id, title, subTitle, comment}) => {
    return useMemo(() => {
        return (
            <div className={`comment-component ${subTitle ? 'subtitle' : ''}`}>
                <img src={require(`../../../../images/icons/home/${id}.svg`).default} alt={id} />
                <h2>{title}</h2>
                {subTitle && <h3>{subTitle}</h3> }
                <p>{comment}</p>
            </div>
        )
    }, [comment, id, subTitle, title]);
}

export default Comment;