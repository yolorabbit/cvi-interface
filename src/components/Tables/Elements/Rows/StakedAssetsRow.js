import { useIsMobile, useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import stakingConfig, { stakingProtocols, stakingViews } from "config/stakingConfig";
import StakingClaim from "components/Actions/StakingClaim";
import { Pairs } from "../Values";
import useStakedData from "components/Hooks/Staking";
import { useSelector } from "react-redux";
import { toBN } from "utils";
import Rewards from './../Values/Rewards';
import { useDataController } from "components/Tables/DataController/DataController";

const StakedAssetsRow = ({rowData: { key: token, protocol, data}, isHeader}) => {
    const isTablet = useIsTablet();

    const RowDataComponent = () => 
    <RowData 
        isHeader={isHeader} 
        token={token} 
        protocol={protocol}
        data={data}
    />

    return isTablet ? <RowDataComponent /> : <tr>
        <RowDataComponent />
    </tr>
}

export default StakedAssetsRow;

const RowData = ({isHeader, token, protocol, data}) => {
    const chainName = useSelector(({app})=>app.selectedNetwork);
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const {cb} = useDataController();
    const header = useMemo(() => stakingConfig.headers[stakingViews.staked], []);
    const [leftToken, rightToken] = token?.split('-');
    const [stakedData, reloadData] = useStakedData(chainName, protocol, token);
    const [amount, setAmount] = useState("");
    return useMemo(() => {
        const stakedTokenAmount = data.staked.stakedTokenAmount ?? 0
        const UnstakeController =
        <ActionController 
            amountLabel="Select amount to unstake*"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={stakingConfig.actionsConfig.unstake.key}
            view={"staking"}
            protocol={protocol}
            disabled={!toBN(stakedTokenAmount).gt(toBN(0))}
            balances={{
                tokenAmount: data.staked.stakedTokenAmount,
                available: data.staked.stakedAmount
            }}
            cb={cb}
        />

        const StakedValue = <Value text={data.staked.stakedAmount} subText={`${token?.toUpperCase()} ${data.staked.lastStakedAmount.value}`} bottomText={`$${data.staked.stakedAmountUSD}`} />
        if(isHeader) {
            return <>
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} /> : 
                    <> 
                        <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} hideNames />
                        {protocol !== "platform" && <RowItem content={StakedValue} /> }
                    </>} 
                />
                {protocol === "platform" && <RowItem content={StakedValue} /> }
                {!isMobile && <RowItem type="action" content={UnstakeController} /> }
            </>
        }
        return (
        <> 
            {!isTablet && <> 
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} showName /> : 
                    <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} />} 
                />
                <RowItem content={StakedValue} />
            </>}

            <RowItem 
                header={header.APY.label} 
                content={<Value text={stakedData.apy[0]} /> } 
            />

            <RowItem 
                header={header.TVL.label} 
                content={<Value 
                    text={stakedData.tvl.stakedAmountUSD} 
                    bottomText={`${stakedData.tvl.stakedAmountLP} ${header.TVL[token]}`} 
                /> } 
            />
    
            <RowItem 
                 header={header["Estimated rewards per day"].label} 
                 content={<Rewards rewards={stakedData.dailyReward} />}
            />

            <RowItem 
                header={header["Claimable rewards"].label} 
                content={<StakingClaim protocol={protocol} tokenName={token} claim={data.claim} submitted={()=>reloadData()}/> } 
            />

            {(!isTablet || isMobile) && <RowItem content={UnstakeController} />}
        </>
        //eslint-disable-next-line
    )}, [stakedData, isTablet, isMobile, amount]);
}