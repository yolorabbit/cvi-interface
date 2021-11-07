import { useMemo, useState, useEffect, useCallback } from 'react';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useW3SDK } from 'components/Hooks';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import Column from 'components/Layout/Column';
import Title from 'components/Elements/Title';
import Button from 'components/Elements/Button';
import Spinner from 'components/Spinner/Spinner';
import { fromBN, toBN } from 'utils';

import './MigrationTest.scss';

const MigrationTest = () => {
    const { account } = useActiveWeb3React();

    const w3 = useW3SDK();
    const [data, setData] = useState();

    const doUnStake = useCallback(async () => {
        const usdtLPStakingRewards = w3.stakingRewards['USDTLPStakingRewards'];
        const bnStakedBalance = await usdtLPStakingRewards.staked(account);
        const stakedBalance = fromBN(bnStakedBalance.stakedAmount, 18);

        if (stakedBalance > 0) {
            await usdtLPStakingRewards.withdrawAll(account);
        }
        else {
            console.log("No Staked Balance");
        }
    }, [w3, account]);

    const getTokenAllowance = async (token, from, to) => {
        return toBN(await token.w3.call(token.contract.methods.allowance, [from, to]));
    }

    const doApprove = useCallback(async () => {
        const usdtusdcPlatformMigrator = w3.platformMigrators['USDTUSDCPlatformMigrator'];
        const usdtLP = w3.tokens['USDTLP'];
        const liquidity = fromBN((await usdtLP.balanceOf(account)), 18);
        const allowance = fromBN((await getTokenAllowance(usdtLP, account, usdtusdcPlatformMigrator.address)), 18);
        if (liquidity <= 0) {
            console.log('No Liquidity');
            return;
        }

        if (allowance >= liquidity) {
            console.log('Already Approved');
            return;
        }

        await usdtLP.approve(account, usdtusdcPlatformMigrator.address);
    }, [w3, account]);

    const doMigration = useCallback(async () => {       
        const usdtusdcPlatformMigrator = w3.platformMigrators['USDTUSDCPlatformMigrator'];
        const result = await usdtusdcPlatformMigrator.canMigrate(account);
        if (result.result)
            await usdtusdcPlatformMigrator.migrate(95, account); // rewards = afterGoviBalance - beforeGoviBalance
        else
            console.log(result.reason);
    }, [w3, account]);

    const currentActiveStep = useCallback(async () => {
        const usdtLPStakingRewards = w3.stakingRewards['USDTLPStakingRewards'];
        const usdtusdcPlatformMigrator = w3.platformMigrators['USDTUSDCPlatformMigrator'];
        const bnStakedBalance = await usdtLPStakingRewards.staked(account);
        const stakedBalance = fromBN(bnStakedBalance.stakedAmount, 18);
        const usdtLP = w3.tokens['USDTLP'];
        const liquidity = fromBN((await usdtLP.balanceOf(account)), 18);
        const allowance = fromBN((await getTokenAllowance(usdtLP, account, usdtusdcPlatformMigrator.address)), 18);
        
        let status = undefined;

        if (stakedBalance > 0) {
            status = 'Unstake';
        }
        
        else if (liquidity > 0) {
            if (allowance >= liquidity) {
                status = 'Approved';
            } else {
                status = 'Liquidity';
            }
        }

        return status;
    }, [w3, account]);

    useEffect(() => {
        const fetchData = async () => {
            const usdtLPStakingRewards = w3.stakingRewards['USDTLPStakingRewards'];
            const stakedBalance = await usdtLPStakingRewards.staked(account);
            const usdtLP = w3.tokens['USDTLP'];
            const usdtLPBalance = await usdtLP.balanceOf(account);
            const govi = w3.tokens['GOVI'];
            const goviBalance = await govi.balanceOf(account);

            const activeStep = await currentActiveStep();
            
            setData({
                stakedBalance: fromBN(stakedBalance.stakedAmount, 18),
                usdtLPBalance: fromBN(usdtLPBalance, 18),
                goviBalance: fromBN(goviBalance, 18),
                status: !!activeStep? activeStep : 'No need'
            })
        }
        if (!!w3) {
            console.log(w3);
            fetchData();
        }
    }, [w3, account, currentActiveStep])

    return useMemo(() => {
        return <>
            <Layout className="migration-test-component">
                <Row>
                    <Column>
                        <Title text="Migrate USDT platform to USDC platform" textAlign="center"></Title>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <span>USDT LP Balance: {data?  data.usdtLPBalance: <Spinner/>}</span>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <span>USDT LP Staked Balance: {data? data.stakedBalance: <Spinner/>}</span>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <span>GOVI Balance: {data? data.goviBalance: <Spinner/>}</span>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <span>Current Step: {data? data.status: <Spinner/>}</span>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Button className="migration-test-component__button" buttonText="Unstake" onClick={doUnStake} />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Button className="migration-test-component__button" buttonText="Approve" onClick={doApprove} />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Button className="migration-test-component__button" buttonText="Migrate" onClick={doMigration} />
                    </Column>
                </Row>
            </Layout>
        </>
    }, [data, doMigration, doUnStake, doApprove])
}

export default MigrationTest;