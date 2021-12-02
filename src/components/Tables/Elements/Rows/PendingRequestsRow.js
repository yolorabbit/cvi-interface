import { useIsMobile, useIsTablet } from "components/Hooks";
import { useMemo } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import arbitrageConfig from "config/arbitrageConfig";
import Countdown from "components/Countdown";
import moment from "moment";

const PendingRequestsRow = ({ rowData, isHeader, className }) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    
    const { 
        amount,
        symbol,
        estimatedNumberOfTokens,
        submitTime,
        submitTimeToFulfillment,
        timeToFulfillmentFee,
        type,
        upfrontPayment,
        fulfillmentIn,
        lastBlockTime,
    } = rowData;

    // Submit Time + 15 minutes
    const submitTimePlus = moment(submitTime * 1000).add(15, 'minutes');
    // Check if locked
    const isLocked = moment(moment.utc(submitTimePlus)).isSameOrAfter(moment.utc(lastBlockTime * 1000));

    const fulfillmentController = useMemo(() => {
        return <ActionController
            action={type}
            isModal
            type={arbitrageConfig.actionsConfig.fulfill.key}
            requestData={rowData}
            disabled={lastBlockTime ? isLocked : true}
        />
    }, [rowData, type, lastBlockTime, isLocked]);

    const RowData = useMemo(() => (
        <>
            {(!isTablet && !isMobile) && 
            <>
                <RowItem
                    header={arbitrageConfig.tables[type].pending.headers.type}
                    content={<Value className="uppercase-first-letter" text={type} />}
                />
                <RowItem
                    header={arbitrageConfig.tables[type].pending.headers.amount}
                    content={<Value text={amount} subText={symbol}/>}
                />
            </>}

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.submitTime}
                content={<Value text={moment(submitTime * 1000).format("DD/MM/YY HH:mm")}/> }
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.submitTimeToFulfillment}
                content={<Value className="small-subtext" text={submitTimeToFulfillment.text} subText={submitTimeToFulfillment.subText}/>}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.timeToFulfillmentFee}
                content={<Value text={timeToFulfillmentFee} subText={symbol} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.upfrontPayment}
                content={<Value text={`${upfrontPayment} ${symbol}`} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.estimatedNumberOfTokens}
                content={<Value text={estimatedNumberOfTokens} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.fulfillmentIn}
                content={<Countdown lockedTime={fulfillmentIn} showIfZero/>}
            />

            {(!isTablet || isMobile) && <RowItem content={
                <div className="row-actions-wrapper">
                    {fulfillmentController}
                </div>
                } />
            }

        </>
    ), [estimatedNumberOfTokens,
        fulfillmentController,
        submitTime,
        submitTimeToFulfillment,
        timeToFulfillmentFee,
        amount,
        symbol,
        type,
        upfrontPayment,
        fulfillmentIn,
        isTablet,
        isMobile]);

    if (isHeader) {
        return  <RowItem
                type={type}
                content={
                    <>
                        <Value className="uppercase-first-letter" text={type} subText={
                            <span className="margin-inline-start">
                                <b>{amount}&nbsp;</b>
                                <span>{symbol}</span>
                           </span>
                            }/>
                        <div className="row-actions-wrapper">
                           {isTablet && !isMobile && fulfillmentController}
                        </div>
                    </>
                }
            />
    }

    return isTablet ? RowData : <tr className={className ?? ''}>
        {RowData}
    </tr>
}

export default PendingRequestsRow;
