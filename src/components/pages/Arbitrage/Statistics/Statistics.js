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
        const { pairToken } = activeToken;
        const loadActiveVol = Object.values(arbitrageConfig.tokens[selectedNetwork]).map(({ oracleId }) => oracleId)[0];
        const tokenContract = w3?.tokens[activeToken.rel.volTokenKey];
        const statisticsDetails = {
            tokenPrice: tokenContract?.uniswapPrice ?? null,
            intrinsicValue: tokenContract?.intrinsicPrice ?? null,
        }
        const { tokenPrice, intrinsicValue } = statisticsDetails;

        return (
            <Container className="arbitrage-statistics-component">
                <Value
                    header="Index"
                    text={loadActiveVol === null ? null : <IndexValue
                        type="arbitrage-statistics"
                        activeIndex={loadActiveVol}
                    />}
                />

                <Value
                    header="Platform price"
                    text={intrinsicValue === null ? null : `${customFixed(intrinsicValue, pairToken.fixedDecimals)} USDC`}
                />

                <Value
                    header={`${arbitrageConfig.exchanges[selectedNetwork].mainExchange.label} price`}
                    text={tokenPrice === null ? null : `${customFixed(tokenPrice, pairToken.fixedDecimals)} USDC`}
                />
            </Container>
        )
    }, [activeToken, selectedNetwork, w3]);
}

export default Statistics;