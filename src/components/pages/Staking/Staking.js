import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import React from 'react'
import './Staking.scss';

const Staking = () => {
    return (
        <div className="staking-component">
            <Layout>
                <Column>
                    <Row>
                        <Container title="Your staked assets">
                            Staked Assets
                        </Container>
                    </Row>

                    <Row>
                        <Container title="Available to stake">
                            Available to stake
                        </Container>
                    </Row>
                </Column>
            </Layout>
        </div>
    )
}

export default Staking;