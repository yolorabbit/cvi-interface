import React, { useCallback, useEffect, useState } from "react";
import "./MigrationModal.scss";
import Modal from "components/Modal/Modal";
import Title from "components/Elements/Title";
import Steps from "./Steps";
import MigrationWelcome from "./MigrationWelcome";
import Unstake from "./Unstake";
import Migrate from "./Migrate";
import Earn from "./Earn";
import config from "config/config";
import { useDispatch, useSelector } from "react-redux";
import { useInDOM } from "components/Hooks";
import { fromBN } from "utils";
import { addAlert, setMigrationModalOpen } from "store/actions";
import { useActiveWeb3React } from "components/Hooks/wallet";
import { actionConfirm } from "store/actions/events";
import { chainNames } from "connectors";

export const MigrationModal = ({w3}) => {
  const dispatch = useDispatch();
  const isActiveInDOM = useInDOM();
  const { account } = useActiveWeb3React();
  const { selectedNetwork } = useSelector(({app}) => app);

  const [isLoading, setIsLoading] = useState();
  const usdtusdcPlatformMigrator = w3 && w3.platformMigrators["USDT-USDC-PlatformMigrator"];
  const [{
    stakedBalance = {},
    usdtLPBalance,
    status = config.migrationStepsTypes.start
  }, setData] = useState({});
 
  // Do Unstake
  const doUnStake = useCallback(async () => {
    try {
      const usdtLPStakingRewards = w3.stakingRewards["USDTLPStakingRewards"];
      const bnStakedBalance = await usdtLPStakingRewards.staked(account);
      const stakedBalance = fromBN(bnStakedBalance.stakedAmount, 18);
      if (stakedBalance > 0) {
        await usdtLPStakingRewards.withdrawAll(account);
      }
      const usdtLP = w3.tokens["USDTLP"];
      const usdtLPBalance = await usdtLP.balanceOf(account);

      if(!isActiveInDOM()) return; 
      
      setData(prev => ({
        ...prev, 
        usdtLPBalance: fromBN(usdtLPBalance, 18),
      }));

    } catch(error) {
      console.log(error);
    }
  }, [w3?.stakingRewards, w3?.tokens, account, isActiveInDOM]);

  // Do Migration
  const doMigration = useCallback(async () => {
    await usdtusdcPlatformMigrator.w3.block.refresh();
    const {result, reason} = await usdtusdcPlatformMigrator.canMigrate(account);
    if (result) {
      await usdtusdcPlatformMigrator.migrate(99, account);
    } else {
      dispatch(addAlert({
        id: 'migration',
        eventName: `${reason} - failed`,
        alertType: config.alerts.types.FAILED,
        message: reason
      }));
    }
  }, [usdtusdcPlatformMigrator, account, dispatch]);

  // Get Active Step
  const currentActiveStep = useCallback(async () => {
    if(!w3?.stakingRewards || !w3?.tokens  || !account) return;

    try {
      const usdtLPStakingRewards = w3.stakingRewards["USDTLPStakingRewards"];
      const bnStakedBalance = await usdtLPStakingRewards.staked(account);
      const stakedBalance = fromBN(bnStakedBalance.stakedAmount, 18);
      const usdtLP = w3.tokens["USDTLP"];
      const liquidity = fromBN(await usdtLP.balanceOf(account), 18);
      let status = stakedBalance > 0 && config.migrationStepsTypes.unstake;
      if (!status && liquidity > 0) {
        return config.migrationStepsTypes.approved;
      }
      return status || config.migrationStepsTypes.liquidity;
    } catch(error) {
      console.log(error);
      return dispatch(addAlert({
        id: 'migration',
        eventName: `Failed to get active step`,
        alertType: config.alerts.types.FAILED,
        message: `Failed to get active step`
      }));
    }
  }, [w3?.stakingRewards, w3?.tokens, account, dispatch]);

  // Migration Actions
  const doMigrationAction = useCallback(async (id) => {
    try {
      switch(status) {
        case config.migrationStepsTypes.unstake:
          return await doUnStake();
  
        case config.migrationStepsTypes.approved: {
          return await doMigration();
        }
  
        default:
            return null
      }
    } catch(error) {
      console.log(error);
    }
  }, [status, doUnStake, doMigration]);

  const onClickHandler = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await doMigrationAction(id);
    } catch(error) {
      console.log(error);
    } finally {
      const _currentActiveStep = await currentActiveStep();

      if(!isActiveInDOM()) return; 

      if(_currentActiveStep) {
        setData(prev => ({
          ...prev,
          status: _currentActiveStep
        }))
      }

      if(selectedNetwork === chainNames.Matic) {
        dispatch(actionConfirm());
      }

      setIsLoading(false);
    }
  }, [currentActiveStep, dispatch, doMigrationAction, isActiveInDOM, selectedNetwork]);

  // Set data
  useEffect(() => {
    if (!w3 || !account || !usdtusdcPlatformMigrator) return;
   
    const fetchData = async () => {
      const stakedBalance = await w3.stakingRewards["USDTLPStakingRewards"].staked(account);
      const usdtLP = w3.tokens["USDTLP"];
      const usdtLPBalance = await usdtLP.balanceOf(account);
      const activeStep = await currentActiveStep();

      if(!isActiveInDOM()) return; 

      setData({
        stakedBalance: fromBN(stakedBalance.stakedAmount, 18),
        usdtLPBalance: fromBN(usdtLPBalance, 18),
        status: !!activeStep ? config.migrationStepsTypes.start : config.migrationStepsTypes["no-need"],
      });
    };

    fetchData();
  }, [w3, account, currentActiveStep, usdtusdcPlatformMigrator, isActiveInDOM]);

  useEffect(() => {
    if (status === config.migrationStepsTypes["no-need"]) return;
    setData(prev => ({...prev, userStakeAmount: usdtLPBalance}));
    dispatch(setMigrationModalOpen(true));
  }, [dispatch, status, usdtLPBalance]);


  const checkCurrentStep = (step) => {
    const isDisabled = !w3 || !account || !usdtusdcPlatformMigrator;
    switch (step) {
      case config.migrationStepsTypes.start:
        return <MigrationWelcome
            stepDetails={config.migrationSteps[0]}
            onClickHandler={() => onClickHandler(config.migrationSteps[0].stepKey)}
            disabled={isDisabled}
            isLoading={isLoading}
        />

      case config.migrationStepsTypes.unstake:
        return <Unstake
            stepDetails={config.migrationSteps[1]}
            onClickHandler={() => onClickHandler(config.migrationSteps[1].stepKey)}
            stakedBalance={stakedBalance} 
            disabled={isDisabled}
            isLoading={isLoading}
          />

      case config.migrationStepsTypes.approved:
        return <Migrate
            stepDetails={config.migrationSteps[2]}
            onClickHandler={onClickHandler}
            usdtLPBalance={usdtLPBalance}
            disabled={isDisabled}
            isLoading={isLoading}
          />

      case config.migrationStepsTypes.liquidity:
        return <Earn 
          stepDetails={config.migrationSteps[3]} 
          onClickHandler={() => onClickHandler(config.migrationSteps[3].stepKey)}
        />

      default:
        return null;
    }
  };

  return (
    <Modal className="migration-modal" closeIcon clickOutsideDisabled handleCloseModal={() => dispatch(setMigrationModalOpen(false))}>
      {status !== config.migrationStepsTypes.start && (
        <>
          <Title
            className="migration-title"
            color="white"
            text="Migrate USDT to USDC liquidity pool"
          />
          <Steps steps={config.migrationSteps} currentStep={status} />
        </>
      )}
      {checkCurrentStep(status)}
    </Modal>
  );
};

export default MigrationModal;
