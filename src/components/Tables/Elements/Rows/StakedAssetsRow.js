import { useIsMobile, useIsTablet } from "components/hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import ActionController from "components/pages/Platform/Actions/ActionController";
import stakingConfig, { stakingViews } from "config/stakingConfig";
import StakingClaim from "components/pages/Platform/Actions/StakingClaim";

const StakedAssetsRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const header = useMemo(() => stakingConfig.headers[stakingViews.staked], []);

    const unstakeController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to unstake"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={stakingConfig.actionsConfig.unstake.key}
        />
    }, [token, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token} />} />
                <RowItem content={<Value text="300" subText={`${token?.toUpperCase()} (0.03%)`} bottomText={"$468"} /> } />
            </>}

            <RowItem 
                header={header.APY.label} 
                content={<Value text="182.29%" /> } 
            />

            <RowItem 
                header={header.TVL.label} 
                content={<Value text="$7,320,500.43" bottomText="3,012,551 CVI-USDT LP" /> } 
            />

            <RowItem 
                header={header["Estimated rewards per day"].label} 
                content={<Value text="0.68257967 GOVI" /> } 
            />

            <RowItem 
                header={header["Claimable rewards"].label} 
                content={<StakingClaim /> } 
            />

            {(!isTablet || isMobile) && <RowItem content={unstakeController} />}
        </>
        //eslint-disable-next-line
    ), [token, isTablet, isMobile, amount]);

    if(isHeader) {
        return <>
            <RowItem content={<Coin token={token} />} />
                  <RowItem content={<Value text="10,000" subText={`${token?.toUpperCase()} (0.01233%)`} bottomText={"$468"} /> } />
            {!isMobile && <RowItem type="action" content={unstakeController} /> }
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default StakedAssetsRow;
