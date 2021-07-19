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
import { toBN } from "utils";

const StakeAssetsRow = ({rowData: { key: token, label, protocol}, isHeader}) => {
    const isTablet = useIsTablet();

    const RowDataComponent = () => 
    <RowData 
        isHeader={isHeader} 
        label={label} 
        token={token} 
        protocol={protocol} 
    />

    return useMemo(()=> {
        return isTablet ? <RowDataComponent /> : <tr><RowDataComponent /></tr>
    //eslint-disable-next-line
    },[]);
}

export default StakeAssetsRow;


const RowData = ({isHeader, label, token, protocol}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const chainName = useSelector(({app}) => app.selectedNetwork);
    const header = useMemo(() => stakingConfig.headers[stakingViews["available-to-stake"]], []);
    const [leftToken, rightToken] = token?.split('-');
    const tokenNameFormatted = leftToken && rightToken ? token.replace(/-([^-]*)$/, ' $1') : token;
    const [stakedData, reloadData] = useStakedData(chainName, protocol, token);
    const { account } = useActiveWeb3React();
    const [amount, setAmount] = useState("");
    
    return useMemo(() => {
        const tokenBalance = stakedData.balance.tokenBalance ?? 0
        const StakeController = 
        <ActionController 
            amountLabel="Select amount to stake"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={stakingConfig.actionsConfig.stake.key}
            view={"staking"}
            protocol={protocol}
            disabled={!toBN(tokenBalance).gt(toBN(0))}
            balances={{
                tokenAmount: stakedData.balance.tokenBalance,
                available: stakedData.balance.tokenBalance
            }}
            cb={()=>reloadData()}
        />

        if(isHeader) {
            return <>
                <RowItem content={
                    stakingProtocols[protocol] === stakingProtocols.platform ? 
                    <Coin token={token} showName /> : 
                    <Pairs leftToken={leftToken} rightToken={rightToken} protocol={protocol} />} 
                />
                {!isMobile && <RowItem type="action" content={StakeController} /> }
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
                content={<Value 
                    text={stakedData.balance.formatted} 
                    subText={label ?? `${tokenNameFormatted?.toUpperCase()}`} 
                    bottomText={`${stakedData.balance.usdBalance}`} 
                    showData={account}
                /> 
            } />

            <RowItem 
                header={header.TVL.label} 
                content={<Value 
                    text={stakedData.tvl.stakedAmountUSD} 
                    bottomText={`${stakedData.tvl.stakedAmountLP} 
                    ${label ?? tokenNameFormatted?.toUpperCase()}`} 
                /> } 
            />

            <RowItem 
                header={header.APY.label} 
                content={<Apy apyList={stakedData.apy} />} 
            />

            {(!isTablet || isMobile) && <RowItem content={StakeController} />}
        </>
        //eslint-disable-next-line
    )}, [stakedData, isTablet, isMobile, account, amount]);
}