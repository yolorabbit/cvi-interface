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
import StakedAmount from "../Values/StakedAmount";
import MigrateAction from "components/Actions/MigrateAction";

const StakedAssetsRow = ({rowData: { key: token, protocol, data}, isHeader}) => {
    const isTablet = useIsTablet();

    return useMemo(() => {
        return isTablet ? <RowData 
            isHeader={isHeader} 
            token={token} 
            protocol={protocol}
            data={data}
        /> : <tr className={`${token === 'govi-v2'? 'highlight': ''}`}>
            <RowData 
                isHeader={isHeader} 
                token={token} 
                protocol={protocol}
                data={data}
            />
        </tr>
    }, [token, protocol, data, isHeader, isTablet])
}

export default StakedAssetsRow;

const RowData = ({isHeader, token, protocol, data}) => {
    const chainName = useSelector(({app})=>app.selectedNetwork);
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const header = useMemo(() => stakingConfig.headers[stakingViews.staked], []);
    const [leftToken, rightToken] = token?.split('-');
    const tokenNameFormatted = leftToken && rightToken ? token.replace(/-([^-]*)$/, ' $1') : token;
    const isStaked = true;
    const [stakedData] = useStakedData(chainName, protocol, token, isStaked);
    const [amount, setAmount] = useState("");

    return useMemo(() => {
        const stakedTokenAmount = data.staked.stakedTokenAmount ?? 0
        const UnstakeController =
        <ActionController 
            amountLabel="Enter amount to unstake*"
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
        />

        const StakedValue = <Value text={data.staked.stakedAmount} subText={`${tokenNameFormatted?.toUpperCase()} ${data.staked.lastStakedAmount.value}`} bottomText={`$${data.staked.stakedAmountUSD}`} protocol={protocol} />
        
        if(isHeader) {
            return <>
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} /> : 
                    <> 
                        <Pairs leftToken={leftToken} rightToken={rightToken} token={token} protocol={protocol} hideNames />
                        {protocol !== "platform" && <RowItem content={StakedValue} /> }
                    </>} 
                />
                {protocol === "platform" && <RowItem content={StakedValue} /> }
                {!isMobile && <RowItem type="action" content={
                    <div className="row-actions-wrapper">
                        {UnstakeController}
                        <MigrateAction tokenName={token}/>
                    </div>
                } /> }
            </>
        }
        return (
        <> 
            {!isTablet && <RowItem content={<StakedAmount token={token} protocol={protocol} StakedValue={StakedValue} />} />}

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
                header={header["Rewards"].label} 
                content={<StakingClaim protocol={protocol} tokenName={token} claim={data.claim} /> } 
            />

            {(!isTablet || isMobile) &&
                <RowItem content={
                    <div className="row-actions-wrapper">
                        {UnstakeController}
                        <MigrateAction tokenName={token}/>
                    </div>
                } />
            }
        </>
        //eslint-disable-next-line
    )}, [stakedData, isTablet, isMobile, amount, data]);
}