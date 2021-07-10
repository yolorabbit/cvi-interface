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
import { useWeb3React } from "@web3-react/core";
import { supportedNetworksConfigByEnv } from 'connectors';

const StakedAssetsRow = ({rowData: { key: token, protocol}, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const [leftToken, rightToken] = token?.split('-');
    const unstakeController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to unstake*"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={stakingConfig.actionsConfig.unstake.key}
        />  //eslint-disable-next-line
    }, [token, amount]);

    if(isHeader) {
        return <>
            <RowItem content={
                stakingProtocols[protocol] === stakingProtocols.platform ? 
                <Coin token={token} /> : 
                <> 
                    <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} hideNames />
                    {protocol !== "platform" && <RowItem content={<Value text="10,000" subText={`${token?.toUpperCase()} (0.01233%)`} bottomText={`$468 (${protocol})`} /> } /> }
                </>} 
            />
            {protocol === "platform" && <RowItem content={<Value text="10,000" subText={`${token?.toUpperCase()} (0.01233%)`} bottomText={`$468 (${protocol})`} /> } /> }
            {!isMobile && <RowItem type="action" content={unstakeController} /> }
        </>
    }

    const RowDataComponent = () => <RowData token={token} protocol={protocol} unstakeController={unstakeController} amount={amount}/>

    return isTablet ? <RowDataComponent /> : <tr>
        <RowDataComponent />
    </tr>
}

export default StakedAssetsRow;

const RowData = ({token, protocol, unstakeController}) => {
    const {chainId} = useWeb3React();
    const chainName = supportedNetworksConfigByEnv[chainId].chainName;
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const header = useMemo(() => stakingConfig.headers[stakingViews.staked], []);
    const [leftToken, rightToken] = token?.split('-');
    const [stakedData] = useStakedData(chainName, protocol, token);
    
    return useMemo(() => {

        return (
        <> 
            {!isTablet && <> 
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} showName /> : 
                    <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} />} 
                />
                <RowItem content={<Value text={stakedData.stakedAmount} subText={`${token?.toUpperCase()} ${stakedData.lastStakedAmount.value}`} bottomText={`$${stakedData.stakedAmountUSD}`} /> } />
            </>}

            <RowItem 
                header={header.APY.label} 
                content={<Value text={stakedData.apy} /> } 
            />

            <RowItem 
                header={header.TVL.label} 
                content={<Value text="$7,320,500.43" bottomText="3,012,551 CVI-USDT LP" /> } 
            />
            {
                // TODO: 
                // Estimated reward should displaying with loop on stakedData.dailyReward
                // TMP: stakedData.dailyReward[0]
            }
            <RowItem 
                header={header["Estimated rewards per day"].label} 
                content={<Value text={`${stakedData.dailyReward[0].amount} ${stakedData.dailyReward[0].symbol}`} /> } 
            />

            <RowItem 
                header={header["Claimable rewards"].label} 
                content={<StakingClaim claim={stakedData.claim}/> } 
            />

            {(!isTablet || isMobile) && <RowItem content={unstakeController} />}
        </>
        //eslint-disable-next-line
    )}, [stakedData, isTablet, isMobile]);
}