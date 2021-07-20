import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import { stakingViews } from 'config/stakingConfig';
import React from 'react'
import StakingAssets from './StakingAssets';
import './Staking.scss';

const Staking = () => {
    return (
        <Layout className="staking-component">
            <Column>
                <Row>
                    <Container title="Your staked assets">
                        <StakingAssets type={stakingViews.staked} />
                    </Container>
                </Row>

                <Row>
                    <Container title="Available to stake">
                        <StakingAssets type={stakingViews['available-to-stake']} />
                    </Container>
                </Row>
            </Column>
        </Layout>
    )
}

export default Staking;