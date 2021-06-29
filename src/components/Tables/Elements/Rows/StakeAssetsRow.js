import { useIsMobile, useIsTablet } from "components/hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import ActionController from "components/pages/Platform/Actions/ActionController";
import stakingConfig, { stakingProtocols, stakingViews } from "config/stakingConfig";
import { Pairs } from "../Values";

const StakeAssetsRow = ({rowData: { key: token, label, protocol}, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const header = useMemo(() => stakingConfig.headers[stakingViews["available-to-stake"]], []);
    const [leftToken, rightToken] = token?.split('-');

    const stakeController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to stake"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={stakingConfig.actionsConfig.stake.key}
        />
    }, [token, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} /> : 
                    <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} />} 
                />
                <RowItem content={<Value text="300" subText={`${token?.toUpperCase()} (0.03%)`} bottomText={"$468"} /> } />
            </>}

            <RowItem 
                header={header.TVL.label} 
                content={<Value text="$7,320,500.43" bottomText="3,012,551 CVI-USDT LP" /> } 
            />

            <RowItem 
                header={header.APY.label} 
                content={<Value text="182.29%" /> } 
            />

            {(!isTablet || isMobile) && <RowItem content={stakeController} />}
        </>
        //eslint-disable-next-line
    ), [token, isTablet, isMobile, amount]);

    if(isHeader) {
        return <>
            <RowItem content={
                stakingProtocols[protocol] === stakingProtocols.platform ? 
                <Coin token={token} /> : 
                <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} />} 
            />
            <RowItem content={<Value text="10,000" subText={`${token?.toUpperCase()} (0.01233%)`} bottomText={"$468"} /> } />
            {!isMobile && <RowItem type="action" content={stakeController} /> }
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default StakeAssetsRow;