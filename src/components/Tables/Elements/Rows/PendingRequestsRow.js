import { useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import arbitrageConfig from "config/arbitrageConfig";


const PendingRequestsRow = ({ rowData, isHeader, className }) => {
    const isTablet = useIsTablet();
    const [amount, setAmount] = useState("");

    const fulfillmentController = useMemo(() => {
        return <ActionController
            amountLabel={rowData.type}
            isModal
            token="usdc"
            amount={amount}
            setAmount={setAmount}
            type={arbitrageConfig.actionsConfig.fulfill.key}
            balances={{
                tokenAmount: "0"
            }}
        />
    }, [amount, rowData.type]);

    const RowData = useMemo(() => (
        <>
            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />


            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem
                header={rowData.type}
                content={<Value text={rowData.type} />}
            />

            <RowItem content={
                <div className="row-actions-wrapper">
                    {fulfillmentController}
                </div>
            } />
        </>
    ), [fulfillmentController, rowData.type]);

    if (isHeader) {
        return <>
            <RowItem content={<Value
                text={RowData.type}
            />} />
        </>
    }

    return isTablet ? RowData : <tr className={className ?? ''}>
        {RowData}
    </tr>
}

export default PendingRequestsRow;
