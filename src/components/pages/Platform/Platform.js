import React, { useState } from 'react';
import { platformViewContext } from 'components/Context';
import SubNavbar from 'components/SubNavbar';
import config from 'config/config';
import Graphs from './Graphs';
import Tables from './Tables';
import Statistics from './Statistics';
import CviStats from './CviStats';
import Column from 'components/Layout/Column';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import Container from 'components/Layout/Container';
import './Platform.scss';
import Form from './Form';

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
                                <Container>
                                    <Form />
                                </Container>
                            </Row>
                        </Column>

                        <Column>
                            <Row flex="unset">
                                <Container>
                                    <CviStats />
                                </Container>
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