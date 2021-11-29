import { useActiveToken, useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import arbitrageConfig from "config/arbitrageConfig";
import config from "config/config";
import Countdown from "components/Countdown";


const PendingRequestsRow = ({ rowData, isHeader, className }) => {
    const isTablet = useIsTablet();
    const [amount, setAmount] = useState("");

    const { 
        amount: tokenAmount,
        estimatedNumberOfTokens,
        submitTime,
        submitTimeToFulfillment,
        timeToFulfillmentFee,
        type,
        upfrontPayment,
    } = rowData
        
    const activeToken = useActiveToken(type, config.routes.arbitrage.path);

    const fulfillmentController = useMemo(() => {
        return <ActionController
            amountLabel={type}
            isModal
            token={activeToken.name}
            amount={amount}
            setAmount={setAmount}
            type={arbitrageConfig.actionsConfig.fulfill.key}
            balances={{
                tokenAmount: "10"
            }}
        />
    }, [activeToken.name, amount, type]);

    const RowData = useMemo(() => (
        <>
            <RowItem
                header={arbitrageConfig.tables[type].pending.headers.type}
                content={<Value className="uppercase-first-letter" text={type} />}
            />

            <RowItem
                header={arbitrageConfig.tables[type].pending.headers.amount}
                content={<Value text={tokenAmount} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.submitTime}
                content={<Value text={submitTime} />}
            />

            <RowItem
                 header={arbitrageConfig.tables[type].pending.headers.submitTimeToFulfillment}
                content={<Value text={submitTimeToFulfillment} />}
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
                content={<Countdown lockedTime={submitTime} />}
            />

            <RowItem content={
                <div className="row-actions-wrapper">
                    {fulfillmentController}
                </div>
            } />
        </>
    ), [estimatedNumberOfTokens, fulfillmentController, submitTime, submitTimeToFulfillment, timeToFulfillmentFee, tokenAmount, type, upfrontPayment]);

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
