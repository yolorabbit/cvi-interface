import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import { stakingViews } from 'config/stakingConfig';
import { stakingViewContext } from 'components/Context';
import React from 'react'
import StakingAssets from './StakingAssets';
import MigrationModalToggle from 'components/Modals/MigrationModal/MigrationModalToggle';
import useCviSdk from "components/Hooks/CviSdk";
import './Staking.scss';

const Staking = () => {
    const w3Filter = { staking: ["StakingV2"] };
    const w3 = useCviSdk(w3Filter);
    return (
        <Layout className="staking-component">
            <stakingViewContext.Provider value={{ w3 }}>
                <MigrationModalToggle />
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
            </stakingViewContext.Provider>
        </Layout>
    )
}

export default Staking;