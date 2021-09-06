import React, { useMemo } from 'react';
import Header from './Header';
import PlatformUsecase from './PlatformUsecase';
import CommentsSection from './CommentsSection';
import { UseCase } from './PlatformUsecase/PlatformUsecase';
import Row from 'components/Layout/Row';
import useCvi from 'components/Hooks/Cvi';
import './Home.scss';

const Home = () => {
    useCvi();

    return useMemo(() => {
        return (
            <div className="home-component">
                <Header />
                <PlatformUsecase />
                <CommentsSection />
                <Row className="govi-dao-row">
                    <UseCase 
                        icon='govi-dao'
                        title='GOVI DAO token'
                        description={() => <span>CVI includes a decentralized governance component, where holders of the GOVI token can vote on matters such as the tradable assets, leverage used, deposit amounts, platform fees, and more. <br/> <br/> By staking their GOVI tokens, GOVI holders will also earn a share of the fees collected from the CVI platform.</span>}
                    />
                </Row>
            </div>
        )
    }, []);
}

export default Home;