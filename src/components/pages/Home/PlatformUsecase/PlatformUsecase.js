import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import React, { useMemo } from 'react';
import CviChartAndData from '../CviChartAndData';
import VolatilityToken from '../VolatilityToken';
import './PlatformUsecase.scss';

const _platformUsecases = [{
    title: "Trade",
    key: 'trade',
    description: `Go long on a position in the index if one believes that the volatility in crypto is about to grow, as a speculation or as a hedge for their portfolio`
  }, {
    title: "Provide liquidity",
    key: 'liquidity',
    description: `Become a platform liquidity provider to earn fees if one believes that the volatility will decrease or remain the same.`
  }, {
    title: "Stake",
    key: 'stake',
    description: `Stake the supported tokens within the platform to earn part of the platform collected fees.
    We also have a liquidity mining program where you can stake different LP tokens and earn GOVI rewards.`
  }, {
    title: "Arbitrage",
    key: 'arbitrage',
    description: `The volatility tokens create a unique and incredible landscape for arbitrageurs to build strategies and profit from any deviation between the DEX/AMMs and the CVI Platform`
}];

const PlatformUsecase = () => {
    return useMemo(() => {
        return (
            <Layout className="platform-usecases-component">
                <Column>
                    <Row>
                        <h2 className="platform-usecases-component__title">CVI platform use case</h2>
                    </Row>
                    <Row className="platform-usecases-component__cards-row">
                        {_platformUsecases.map(({title, key, description}) => <UseCase key={key} icon={key} title={title} description={description} />)}
                    </Row>
                </Column>

                <Row className="graph-section">
                    <CviChartAndData />
                    <VolatilityToken />
                </Row>
            </Layout>
        )
    }, []);
}

export const UseCase = ({title, icon, description}) => {
    return useMemo(() => {
        return (
            <Container className="usecase-component">
                <div className="usecase-component__icon">
                    <img src={require(`../../../../images/icons/home/${icon}.svg`).default} alt={icon} />
                </div>

                <h3>{title}</h3>
                <p>{typeof description === 'function' ? description() : description}</p>
            </Container>
        )
    }, [title, description, icon]);   
}

export default PlatformUsecase;