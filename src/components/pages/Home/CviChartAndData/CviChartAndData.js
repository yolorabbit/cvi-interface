import Container from 'components/Layout/Container';
import CviStats from 'components/pages/Platform/CviStats';
import Graphs from 'components/pages/Platform/Graphs';
import React, { useMemo } from 'react';
import './CviChartAndData.scss';

const CviChartAndData = () => {
    
    return useMemo(() => {
        return (
            <Container className="cvi-index-chart-and-data-component">
                <h3>CVI Index Chart & Data</h3>
                <CviStats type="home" />
                <Graphs tabs={["cvi index"]} />
            </Container>
        )
    }, []);
}

export default CviChartAndData;