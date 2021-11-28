import Container from 'components/Layout/Container';
import IndexValue from 'components/pages/Platform/IndexStats/IndexValue';
import { Value } from 'components/Tables/Elements/Values';
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import './Statistics.scss';

const Statistics = () => {
    const { selectedNetwork } = useSelector(({app}) => app);

    return useMemo(() => {
        if(!selectedNetwork) return null;
        const loadActiveVol = Object.values(arbitrageConfig.tokens[selectedNetwork]).map(({oracleId}) => oracleId)[0];

        return (
            <Container className="arbitrage-statistics-component">
                <Value 
                    subText="Index" 
                    bottomText={<IndexValue 
                        type="arbitrage-statistics"
                        activeIndex={loadActiveVol} 
                    />}
                />

                <Value 
                    subText="Platform price"
                    bottomText="1000 USDC" 
                />

                <Value 
                    subText="Uniswap price"
                    bottomText="1000 USDC" 
                />
            </Container>
        )
    }, [selectedNetwork]);
}

export default Statistics;