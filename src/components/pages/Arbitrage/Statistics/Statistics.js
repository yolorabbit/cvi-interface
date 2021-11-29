import { appViewContext } from 'components/Context';
import { useActiveToken } from 'components/Hooks';
import Container from 'components/Layout/Container';
import IndexValue from 'components/pages/Platform/IndexStats/IndexValue';
import { Value } from 'components/Tables/Elements/Values';
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { customFixed } from 'utils';
import './Statistics.scss';

const Statistics = () => {
    const { selectedNetwork } = useSelector(({ app }) => app);
    const { w3 } = useContext(appViewContext);
    const activeToken = useActiveToken();

    return useMemo(() => {
        if (!selectedNetwork || !activeToken) return null;

        const loadActiveVol = Object.values(arbitrageConfig.tokens[selectedNetwork]).map(({ oracleId }) => oracleId)[0];
        const tokenContract = w3?.tokens[activeToken.rel.contractKey];
        const statisticsDetails = {
            tokenPrice: tokenContract?.price ?? null,
            intrinsicValue: tokenContract?.intrinsicPrice ?? null,
        }
        const { tokenPrice, intrinsicValue } = statisticsDetails;


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
                    header="Platform price"
                    text={intrinsicValue ? customFixed(intrinsicValue, activeToken.fixedDecimals) : null}
                />

                <Value
                    header="Uniswap price"
                    text={tokenPrice ? customFixed(tokenPrice, activeToken.fixedDecimals) : null}
                />
            </Container>
        )
    }, [activeToken, selectedNetwork, w3]);
}

export default Statistics;