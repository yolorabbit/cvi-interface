import React, { useState } from 'react';
import Column from '../../Layout/Column/Column';
import Container from '../../Layout/Container';
import Layout from '../../Layout/Layout';
import Row from '../../Layout/Row';
import SubNavbar from '../../SubNavbar';
import TabsForm from '../../TabsForm';
import './Platform.scss';

const Platform = () => {
    const [activeTab, setActiveTab] = useState("positions");
    const [activeTabZ, setActiveTabZ] = useState("cvi index");

    return (
        <div className="platform-component">
            <SubNavbar />

            <Layout>
                <Row>
                    <Column>
                        <Row>
                            <Container>
                    
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
                            <Container>
                                <TabsForm 
                                    tabs={["cvi index", "funding fee"]} 
                                    activeTab={activeTabZ} 
                                    setActiveTab={(tab) => setActiveTabZ(tab)}>
                                
                                </TabsForm>
                            </Container>
                        </Row>
                    </Column>
                </Row>

                <Row>
                    <Container>
                        <TabsForm 
                            tabs={["positions", "history"]} 
                            activeTab={activeTab} 
                            setActiveTab={(tab) => setActiveTab(tab)}>
                        
                        </TabsForm>
                    </Container>
                </Row>
            </Layout>
        </div>
    )
}

export default Platform;