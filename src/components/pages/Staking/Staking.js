import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import React from 'react'
import StakedAssets from './StakedAssets';
import './Staking.scss';

const Staking = () => {
    return (
        <Layout className="staking-component">
            <Column>
                <Row>
                    <Container title="Your staked assets">
                        <StakedAssets />
                    </Container>
                </Row>

                <Row>
                    <Container title="Available to stake">
                        Available to stake
                    </Container>
                </Row>
            </Column>
        </Layout>
    )
}

export default Staking;