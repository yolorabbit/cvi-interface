import React, { useMemo } from 'react';
import Comment from '../Comment/Comment';
import './CommentsSection.scss';

const CommentsSection = () => {
    return useMemo(() => {
        return (
            <div className="comments-component">
                <Comment 
                    id="stansberry" 
                    title="Professor Dan Galai," 
                    subTitle="Creator of VIX and CVI advisor" 
                    comment={`"We think the CVI will only grow more important. As the crypto market 
                    continues to grow, more and more investors will want to understand, track, 
                    hedge against, and profit from its volatility. The CVI has established itself as the 
                    best way to do that."`}
                />
                
                <Comment 
                    id="stansberry"
                    title="Stansberry Research"
                    comment={`"We think the CVI will only grow more important. As the crypto market 
                    continues to grow, more and more investors will want to understand, track, 
                    hedge against, and profit from its volatility. The CVI has established itself as 
                    the best way to do that."`}
                />
            </div>
        )
    }, []);
}

export default CommentsSection;