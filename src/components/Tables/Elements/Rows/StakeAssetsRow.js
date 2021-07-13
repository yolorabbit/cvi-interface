import { useIsMobile, useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import ActionController from "components/Actions/ActionController";
import stakingConfig, { stakingProtocols, stakingViews } from "config/stakingConfig";
import { Pairs } from "../Values";
import Apy from "../Values/Apy";
import { useActiveWeb3React } from '../../../Hooks/wallet';
import useStakedData from "components/Hooks/Staking";
import { useSelector } from "react-redux";

const StakeAssetsRow = ({rowData: { key: token, label, protocol}, isHeader}) => {
    const { account } = useActiveWeb3React();
    const isTablet = useIsTablet();
    const [amount, setAmount] = useState("");
    
    const stakeController = useMemo(() => {
        return <ActionController 
            disabled={!account}
            amountLabel="Select amount to stake"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={stakingConfig.actionsConfig.stake.key}
        />
    }, [token, amount, account]);

    const RowDataComponent = () => 
    <RowData 
        isHeader={isHeader} 
        label={label} 
        token={token} 
        protocol={protocol} 
        stakeController={stakeController} 
        amount={amount} />


    return useMemo(()=> {
        return isTablet ? <RowDataComponent /> : <tr><RowDataComponent /></tr>
    //eslint-disable-next-line
    },[]);
}

export default StakeAssetsRow;


const RowData = ({isHeader, label, token, protocol, stakeController}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const chainName = useSelector(({app}) => app.selectedNetwork);
    const header = useMemo(() => stakingConfig.headers[stakingViews["available-to-stake"]], []);
    const [leftToken, rightToken] = token?.split('-');
    const [stakedData] = useStakedData(chainName, protocol, token);
    
    return useMemo(() => {
        // console.log(stakedData);
        if(isHeader) {
            return <>
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} showName /> : 
                    <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} />} 
                />
                {!isMobile && <RowItem type="action" content={stakeController} /> }
            </>
        }
        return (
        <> 
            {!isTablet && <> 
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} showName /> : 
                    <Pairs leftToken={leftToken} rightToken={rightToken} label={label} protocol={protocol} />} 
                />
            </>}

            <RowItem 
                header={header["Your wallet balance"].label}
                content={<Value text={stakedData.balance.formatted} 
                subText={label ?? `${token?.toUpperCase()}`} 
                bottomText={`${stakedData.balance.usdBalance}`} /> } 
            />

            <RowItem 
                header={header.TVL.label} 
                content={<Value text={`${stakedData.tvl.stakedAmountUSD}`} bottomText={`${stakedData.tvl.stakedAmountLP} ${label ?? token?.toUpperCase()}`} /> } 
            />

            <RowItem 
                header={header.APY.label} 
                content={<Apy apyList={stakedData.apy} />} 
            />

            {(!isTablet || isMobile) && <RowItem content={stakeController} />}
        </>
        //eslint-disable-next-line
    )}, [stakedData, isTablet, isMobile]);
}