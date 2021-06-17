import React, { useState } from 'react';
import Column from '../../Layout/Column/Column';
import Container from '../../Layout/Container';
import Layout from '../../Layout/Layout';
import Row from '../../Layout/Row';
import SubNavbar from '../../SubNavbar';
import Graphs from './Graphs';
import Tables from './Tables';
import config from '../../../config/config';
import './Platform.scss';
import { platformViewContext } from 'components/Context';
import Statistics from 'components/Statistics/Statistics';

const Platform = () => {
    const [activeView, setActiveView] = useState();

    return (
        <div className="platform-component">
            <SubNavbar tabs={Object.keys(config.tabs['sub-navbar'])} activeView={activeView} setActiveView={setActiveView} />

            <platformViewContext.Provider value={{activeView}}>
                <Layout>
                    <Row>
                        <Column>
                            <Row>
                                <Container>
                                    <Statistics />
                                </Container>
                            </Row>

                            <Row>
                                <Container />
                            </Row>
                        </Column>

                        <Column>
                            <Row>
                                <Container />
                            </Row>

                            <Row>
                                <Graphs />
                            </Row>
                        </Column>
                    </Row>

                    <Row>
                        <Tables />
                    </Row>
                </Layout>
            </platformViewContext.Provider>
        </div>
    )
}

export default Platform;