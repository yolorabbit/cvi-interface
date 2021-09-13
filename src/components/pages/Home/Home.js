import React, { useMemo } from 'react';
import Header from './Header';
import PlatformUsecase from './PlatformUsecase';
import { UseCase } from './PlatformUsecase/PlatformUsecase';
import Row from 'components/Layout/Row';
import useCvi from 'components/Hooks/Cvi';
import './Home.scss';
import CviChartAndData from './CviChartAndData';

const Home = () => {
    useCvi();

    return useMemo(() => {
        return (
            <div className="home-component">
                <Header />
                <PlatformUsecase />
                
                <Row className="graph-section">
                    <CviChartAndData />
                </Row>

                <Row className="govi-dao-row">
                    <UseCase 
                        type="inner-icon"
                        icon='govi-dao'
                        title='GOVI DAO token'
                        description={() => <span>CVI includes a decentralized governance component, where holders of the GOVI token can vote on matters such as the tradable assets, leverage used, deposit amounts, platform fees, and more. <br/> <br/> By staking their GOVI tokens, GOVI holders will also earn a share of the fees collected from the CVI platform.</span>}
                    />

                    <UseCase 
                        type="inner-icon"
                        icon='volatility-token'
                        title='Volatility Tokens'
                        description={() => <span>
                            Volatility tokens bring a new and innovative concept for trading volatility while making the CVI eco-system composable with the greater DeFi ecosystem. <br/> <br/>
                            The architecture is based on the first of its kind funding fee adjusted and rebased volatility tokens. <br/>
                            Therefore, the tokens remain pegged to the index over time, allowing any user to buy and sell the tokens on secondary markets.
                        </span>}
                    />
                </Row>
            </div>
        )
    }, []);
}

export default Home;