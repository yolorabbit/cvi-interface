import React, {  useMemo, useState } from 'react';
import { platformViewContext } from 'components/Context';
import SubNavbar from 'components/SubNavbar';
import Graphs from './Graphs';
import Statistics from './Statistics';
import CviStats from './CviStats';
import Column from 'components/Layout/Column';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import Container from 'components/Layout/Container';
import Form from './Form';
import './Platform.scss';
import platformConfig from 'config/platformConfig';
import PlatformTables from './PlatformTables';

const Platform = () => {
    const [activeView, setActiveView] = useState();

    return useMemo(() => (
        <div className="platform-component">
            <SubNavbar tabs={Object.keys(platformConfig.tabs['sub-navbar'])} activeView={activeView} setActiveView={setActiveView} />
           
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
                        <PlatformTables />
                    </Row>
                </Layout>
            </platformViewContext.Provider>
        </div>
    ), [activeView]);
}

export default Platform;