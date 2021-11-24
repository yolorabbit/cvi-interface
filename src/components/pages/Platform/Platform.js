import React, { useMemo, useState } from 'react';
import { appViewContext } from 'components/Context';
import SubNavbar from 'components/SubNavbar';
import Statistics from './Statistics';
import Column from 'components/Layout/Column';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import Container from 'components/Layout/Container';
import platformConfig from 'config/platformConfig';
import PlatformTables from './PlatformTables';
import useHistoryEvents from 'components/Hooks/useHistoryEvents';
import IndexStats from './IndexStats';
import IndexTabs from './IndexTabs';
import useCvi from 'components/Hooks/Cvi';
import MigrationModalToggle from 'components/Modals/MigrationModal/MigrationModalToggle';
import './Platform.scss';


const Platform = () => {
    const [activeView, setActiveView] = useState();

    useHistoryEvents();
    useCvi();

    return useMemo(() => {
        return (
            <div className="platform-component">
                <SubNavbar tabs={Object.keys(platformConfig.tabs['sub-navbar'])} activeView={activeView} setActiveView={setActiveView} />
                <MigrationModalToggle />
                <appViewContext.Provider value={{activeView}}>
                    <Layout>
                        <Row className="statistics-row-component">
                            <Column>
                                <Row>
                                    <Statistics />
                                </Row>
                            </Column>
    
                            <Column>
                                <Row>
                                    <Container className="index-stats-container">
                                        <IndexStats />
                                    </Container>
                                </Row>
                            </Column>
                        </Row>

                        <Row flex="100%">
                            <IndexTabs />
                        </Row>

                        <Row>
                            <PlatformTables />
                        </Row>
                    </Layout>
                </appViewContext.Provider>
            </div>
        )
    }, [activeView]);
}

export default Platform;