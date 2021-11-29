import { useIsTablet } from "components/Hooks";
import { useMemo } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import arbitrageConfig from "config/arbitrageConfig";
import Countdown from "components/Countdown";

const PendingRequestsRow = ({ rowData, isHeader, className }) => {
    const isTablet = useIsTablet();
    const { 
        amount: tokenAmount,
        estimatedNumberOfTokens,
        submitTime,
        submitTimeToFulfillment,
        timeToFulfillmentFee,
        type,
        upfrontPayment,
        fulfillmentIn,
    } = rowData
    
    const fulfillmentController = useMemo(() => {
        return <ActionController
            action={type}
            isModal
            type={arbitrageConfig.actionsConfig.fulfill.key}
            requestData={rowData}
            disabled={false} // change to timestamp > timestamp + 15min;
        />
    }, [rowData, type]);

    const RowData = useMemo(() => (
        <>
            <RowItem
                header={arbitrageConfig.tables[type].pending.headers.type}
                content={<Value className="uppercase-first-letter" text={type} />}
            />

            <RowItem
                header={arbitrageConfig.tables[type].pending.headers.amount}
                content={<Value text={tokenAmount}/>}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.submitTime}
                content={<Value text={submitTime} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.submitTimeToFulfillment}
                content={<Value text={submitTimeToFulfillment} subText="HH:MM"/>}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.timeToFulfillmentFee}
                content={<Value text={timeToFulfillmentFee} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.upfrontPayment}
                content={<Value text={upfrontPayment} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.estimatedNumberOfTokens}
                content={<Value text={estimatedNumberOfTokens} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.fulfillmentIn}
                content={<Countdown lockedTime={fulfillmentIn} />}
            />

            <RowItem content={
                <div className="row-actions-wrapper">
                    {fulfillmentController}
                </div>
            } />
        </>
    ), [estimatedNumberOfTokens,
        fulfillmentController,
        submitTime,
        submitTimeToFulfillment,
        timeToFulfillmentFee,
        tokenAmount,
        type,
        upfrontPayment,
        fulfillmentIn]);

    if (isHeader) {
        return <>
            <RowItem
                content={<Value className="uppercase-first-letter" text={type} />}
            />
        </>
    }

    return isTablet ? RowData : <tr className={className ?? ''}>
        {RowData}
    </tr>
}

export default PendingRequestsRow;
