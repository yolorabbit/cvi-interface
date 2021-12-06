import { useIsMobile, useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import arbitrageConfig from "config/arbitrageConfig";
import moment from "moment";
import FulfillmentInTimer from "components/pages/Arbitrage/FulfillmentInTimer";

const PendingRequestsRow = ({ rowData, isHeader, className }) => {
    const [actionType, setActionType] = useState(arbitrageConfig.actionsConfig.fulfill.key);
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    
    const { 
        amount,
        symbol,
        submitTime,
        submitTimeToFulfillment,
        timeToFulfillmentFee,
        type,
        upfrontPayment,
        fulfillmentIn,
        lastBlockTime,
    } = rowData;

    const submitTimePlus = moment(submitTime * 1000).add(15, 'minutes'); // Submit Time + 15 minutes
    const isLocked = moment(moment.utc(submitTimePlus)).isSameOrAfter(moment.utc(lastBlockTime * 1000)); // Check if locked
    const amountToFulfill = amount - upfrontPayment;

    const fulfillmentController = useMemo(() => {
        return <ActionController
            action={type}
            isModal
            type={actionType}
            requestData={rowData}
            disabled={lastBlockTime ? isLocked : true}
        />
    }, [type, actionType, rowData, lastBlockTime, isLocked]);

    const RowData = useMemo(() => (
        <>
            {(!isTablet && !isMobile) && <RowItem
                header={arbitrageConfig.tables[type].pending.headers.type}
                content={<Value className="uppercase-first-letter" text={type} />}
            />}

            <RowItem
                header={arbitrageConfig.tables[type].pending.headers.amount}
                content={<Value text={amount} subText={symbol}/>}
            />

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
                content={<Value text={timeToFulfillmentFee} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.upfrontPayment}
                content={<Value text={`${upfrontPayment} ${symbol}`} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.amountToFulfill}
                content={<Value text={`${amountToFulfill} ${symbol}`} />}
            />

            {!isTablet && <RowItem
                header={arbitrageConfig.tables[type].pending.headers.fulfillmentIn}
                content={<FulfillmentInTimer 
                    fulfillmentIn={fulfillmentIn} 
                    setActionType={setActionType}
                />}
            />}

            {(!isTablet || isMobile) && <RowItem content={
                <div className="row-actions-wrapper">
                    {fulfillmentController}
                </div>
                } />
            }

        </>
    ), [fulfillmentController,
         submitTime,
         submitTimeToFulfillment,
         timeToFulfillmentFee,
         amount,
         symbol,
         type,
         upfrontPayment,
         fulfillmentIn,
         isTablet,
         isMobile,
         amountToFulfill]
         );

    if (isHeader) {
        return <RowItem
                type={type}
                content={
                    <>
                        <Value className="uppercase-first-letter" text={type} />
                        <FulfillmentInTimer 
                            fulfillmentIn={fulfillmentIn} 
                            setActionType={setActionType} 
                        />
                    </>
                }
            />
    }

    return isTablet ? RowData : <tr className={className ?? ''}>
        {RowData}
    </tr>
}

export default PendingRequestsRow;
