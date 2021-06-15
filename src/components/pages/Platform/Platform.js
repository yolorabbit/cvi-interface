import React from 'react';
import Column from '../../Layout/Column/Column';
import Container from '../../Layout/Container';
import Layout from '../../Layout/Layout';
import Row from '../../Layout/Row';
import SubNavbar from '../../SubNavbar';
import Graphs from './Graphs';
import Tables from './Tables';
import './Platform.scss';

const Platform = () => {

    return (
        <div className="platform-component">
            <SubNavbar />

            <Layout>
                <Row>
                    <Column>
                        <Row>
                            <Container />
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
        </div>
    )
}

export default Platform;