import { useInDOM, useW3SDK } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMigrationModalOpen } from 'store/actions';
import MigrationModal from '.';
import { useCallback } from 'react';
import { toBN } from 'utils';

const MigrationModalToggle = () => {
    const isActiveInDOM = useInDOM();
    const dispatch = useDispatch();
    const { account } = useActiveWeb3React();
    const { migrationModalIsOpen, migrationModalInitiallized } = useSelector(({app}) => app);
    const [isProvidedLiquidity, setIsProvidedLiquidity] = useState();
    const w3 = useW3SDK();

    const isLiquidityProvider = useCallback(async () => {
        try {
            const usdtLP = w3.tokens["USDTLP"];
            const stakedBalance = await w3.stakingRewards["USDTLPStakingRewards"].staked(account);
            const usdtLPBalance = await usdtLP.balanceOf(account);
       
            if(!isActiveInDOM()) return; 
   
            const hasLiquidityAmount = usdtLPBalance?.gt(toBN("0"));
            const hasStakeAmount = stakedBalance?.stakedAmount?.gt(toBN("0"));
  
            setIsProvidedLiquidity(hasStakeAmount || hasLiquidityAmount);
        } catch(error) {
            console.log(error);
        }
    }, [account, w3?.stakingRewards, w3?.tokens, isActiveInDOM])

    useEffect(() => {
        if(!w3 || !account) return;
        isLiquidityProvider();
    }, [w3, account, isLiquidityProvider]);

    useEffect(() => {
        if(!account || migrationModalInitiallized || !isProvidedLiquidity) return;
        dispatch(setMigrationModalOpen(true, true));
    }, [account, migrationModalInitiallized, isProvidedLiquidity, dispatch]);

    return useMemo(() => {
        return migrationModalIsOpen && (
            <MigrationModal w3={w3} />
        )
    }, [migrationModalIsOpen, w3]);
}

export default MigrationModalToggle;