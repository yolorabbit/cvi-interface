
import { useActiveToken, useIsTablet } from "components/Hooks";
import { appViewContext } from 'components/Context';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import arbitrageConfig, { activeTabs, activeViews } from 'config/arbitrageConfig';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Container from 'components/Layout/Container';
import TabsForm from 'components/TabsForm';
import './ArbitrageTables.scss';
import moment from 'moment';
import { commaFormatted, customFixed, customFixedTokenValue, toBN, toDisplayAmount } from 'utils/index';
import { upperFirst } from "lodash";
import { MAX_PERCENTAGE } from "contracts/utils";
import { getLatestBlockTimestamp } from 'contracts/web3Api';
import { useWeb3React } from "@web3-react/core";
import config from "config/config";

const ArbitrageTables = () => {
    const [activeTab, setActiveTab] = useState();
    const { activeView } = useContext(appViewContext);
    return useMemo(() => {
        if(!activeView) return null;
   
        const renderView = () => {
            if(!activeTab) return null;
            switch(activeTab) {
                case activeViews.history:
                    return <HistoryTable activeTab={activeTab} />
                default:
                    return <DefaultTable activeTab={activeTab} />
            }
        }

        return (
            <Container className="arbitrage-tables-component">
                <TabsForm 
                    id="table"
                    tabs={arbitrageConfig.tablesInfo[activeView].tabs} 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab)}
                >
                    {renderView()}
                </TabsForm>
            </Container>
        )
    }, [activeTab, activeView]);
}

const DataView = () => {
    const isTablet = useIsTablet();
    return useMemo(() => {
        return isTablet ? <ExpandList /> : <Table />
    }, [isTablet]);
}

const DefaultTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    const [lastBlockTime, setLastBlockTime] = useState();
    const { unfulfilledRequests } = useSelector(({wallet}) => wallet);
    const activeToken = useActiveToken()
    const { library } = useWeb3React(config.web3ProviderId);

    useEffect(() => {
        const latestBlockTimestamp = async () => {
            try {
                const latestBlockTime = await getLatestBlockTimestamp(library.eth.getBlock);
                setLastBlockTime(latestBlockTime);
            } catch (error) {
                console.log(error)
            }
        }
        if (!lastBlockTime) {
            latestBlockTimestamp()
        }
    }, [library, unfulfilledRequests, activeTab, lastBlockTime])

    return useMemo(() => {
        const tableHeaders = arbitrageConfig.tables[activeView][activeTab].headers;
        const data = unfulfilledRequests ? unfulfilledRequests.map(({
            event, id, requestId, requestType, submitFeesAmount, targetTimestamp, timestamp, tokenAmount,
        }) => {
            const MAX_UPFRONT_FEE = toBN("500");
            const requestTypeLabel = arbitrageConfig.requestType[requestType];
            const eventTokenProperties = activeToken[`${requestTypeLabel}Properties`];
            const timeDelayFeeAmount = toBN(tokenAmount).sub(toBN(toBN(tokenAmount).sub(toBN(submitFeesAmount))));
            const maxFeeAmount = toBN(tokenAmount).div(toBN(MAX_PERCENTAGE)).mul(MAX_UPFRONT_FEE);
            const advanceAmount = toBN(maxFeeAmount).add(toBN(timeDelayFeeAmount));
            const submitTimeSubmitFeeDiff = moment(targetTimestamp*1000).diff(timestamp*1000)
            const SubmitFeeLastBlockDiff = moment(targetTimestamp*1000).diff(lastBlockTime*1000)
            return {
                event,
                id,
                requestId,
                type: requestTypeLabel,
                amount: toDisplayAmount(tokenAmount, eventTokenProperties?.decimals),
                symbol: eventTokenProperties?.label.toUpperCase(),
                submitTime: timestamp,
                submitTimeToFulfillment: {
                    text: moment.utc(moment.duration(submitTimeSubmitFeeDiff).asMilliseconds()).format("HH:mm"),
                    subText: "HH:MM"
                },
                timeToFulfillmentFee: commaFormatted(customFixed(toDisplayAmount(submitFeesAmount, eventTokenProperties?.decimals), eventTokenProperties.fixedDecimals)),
                upfrontPayment: commaFormatted(customFixed(toDisplayAmount(advanceAmount, eventTokenProperties.decimals), eventTokenProperties.fixedDecimals)),
                estimatedNumberOfTokens: commaFormatted(customFixed(toDisplayAmount(tokenAmount*1000, eventTokenProperties.decimals), eventTokenProperties.customFixed)),
                fulfillmentIn: moment.duration(SubmitFeeLastBlockDiff).asMilliseconds(),
                action: true,
                lastBlockTime
            }
        }) : null;

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={data}
            showPaginator
            customTableHeaders={!tableHeaders ? [] : Object.values(tableHeaders)}
        >
           <DataView />
        </DataController>
    }, [activeTab, activeToken, unfulfilledRequests, lastBlockTime]) // eslint-disable-line
}

const HistoryTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    const { arbitrage } = useSelector(({wallet}) => wallet);
    const activeToken = useActiveToken();

    return useMemo(() => {
        const tableHeaders = arbitrageConfig.tables[activeView][activeTab].headers;
        const historyData = arbitrage ? arbitrage.map(({
            event, tokenAmount, mintedShortTokens, mintedTokens
        }) => {
            const fromToken = arbitrageConfig.requestType[event] === activeTabs.burn ? activeToken : activeToken.pairToken;
            const fromTokenLabel = fromToken.name.toUpperCase();
            const toToken = arbitrageConfig.requestType[event] === activeTabs.burn ? activeToken.pairToken : activeToken;
            const toTokenName = toToken?.name.toUpperCase();
            const type = upperFirst(arbitrageConfig.requestType[event]);
            const amount = `${commaFormatted(customFixed(toDisplayAmount(tokenAmount, fromToken.decimals), fromToken.fixedDecimals))}`;
            const tokenlpName = `${fromToken.oracleId.toUpperCase()}-${fromToken.name.toUpperCase()}-LP`;
            const _mintedShortToken = commaFormatted(customFixedTokenValue(mintedShortTokens, fromToken.fixedDecimals, fromToken.lpTokensDecimals));
            const receivedTokens = commaFormatted(customFixedTokenValue(mintedTokens, toToken.fixedDecimals, toToken.decimals));

            return {
                type,
                amount: `${amount} ${fromTokenLabel}`,
                collateralMint: mintedShortTokens ? `${_mintedShortToken} ${tokenlpName}` : 0,
                receivedTokens: `${receivedTokens} ${toTokenName}`,
            }
        }) : null;

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={historyData}
            showPaginator
            customTableHeaders={!tableHeaders ? [] : Object.values(tableHeaders)}
        >
            <DataView />
        </DataController>
    }, [activeTab, activeToken, arbitrage]); // eslint-disable-line
}


export default ArbitrageTables;