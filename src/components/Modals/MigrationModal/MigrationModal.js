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
import { useDispatch } from "react-redux";
import { useW3SDK } from "components/Hooks";
import { fromBN, toBN } from "utils";
import { addAlert } from "store/actions";
import { useActiveWeb3React } from "components/Hooks/wallet";

export const MigrationModal = ({
  setMigrationModalIsOpen
}) => {
  const dispatch = useDispatch();
  const w3 = useW3SDK({
    platformMigrator: ["USDT-USDC-PlatformMigrator"]
  });
  const { account } = useActiveWeb3React();
  const [{
    usdtLPBalance,
    userStakeAmount = 0,
    status = config.migrationStepsTypes.start
  }, setData] = useState({});
  const usdtusdcPlatformMigrator = w3 && w3.platformMigrators["USDT-USDC-PlatformMigrator"];

  // Do Unstake
  const doUnStake = useCallback(async () => {
    const usdtLPStakingRewards = w3.stakingRewards["USDTLPStakingRewards"];
    const bnStakedBalance = await usdtLPStakingRewards.staked(account);
    const stakedBalance = fromBN(bnStakedBalance.stakedAmount, 18);
    if (stakedBalance > 0) {
      await usdtLPStakingRewards.withdrawAll(account);
    }
  }, [w3, account]);

  // Get Token Alowance
  const getTokenAllowance = async (token, from, to) => {
    return toBN(
      await token.w3.call(token.contract.methods.allowance, [from, to])
    );
  };

  // Do Approve
  const doApprove = useCallback(async () => {
    const usdtLP = w3.tokens["USDTLP"];
    const liquidity = fromBN(await usdtLP.balanceOf(account), 18);
    const allowance = fromBN(
      await getTokenAllowance(
        usdtLP,
        account,
        usdtusdcPlatformMigrator?.address
      ),
      18
    );

    if (liquidity <= 0) {
      console.log("No Liquidity");
      return;
    }

    if (allowance >= liquidity) {
      console.log("Already Approved");
      return dispatch(addAlert({
        id: 'migration',
        eventName: `Already approved - failed`,
        alertType: config.alerts.types.FAILED,
        message: "Already approved."
      }));
    }

    await usdtLP.approve(account, usdtusdcPlatformMigrator?.address);
  }, [w3?.tokens, account, usdtusdcPlatformMigrator?.address, dispatch]);

  // Do Migration
  const doMigration = useCallback(async () => {
    const {result, reason} = await usdtusdcPlatformMigrator.canMigrate(account);
    if (result) {
      await usdtusdcPlatformMigrator.migrate(95, account);
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
      const allowance = fromBN(
        await getTokenAllowance(
          usdtLP,
          account,
          usdtusdcPlatformMigrator?.address
        ),
        18
      );
      let status = stakedBalance > 0 && config.migrationStepsTypes.unstake;
      if (!status && liquidity > 0) {
        status = allowance >= liquidity ? config.migrationStepsTypes.approved : config.migrationStepsTypes.liquidity
      }
      return status;
    } catch(error) {
      console.log(error);
      return dispatch(addAlert({
        id: 'migration',
        eventName: `Failed to get active step`,
        alertType: config.alerts.types.FAILED,
        message: `Failed to get active step`
      }));
    }
  }, [w3?.stakingRewards, w3?.tokens, account, usdtusdcPlatformMigrator?.address, dispatch]);

  // Migration Actions
  const doMigrationAction = useCallback(async (id) => {
    console.log(`doMigrationAction currentStep: ${id} : ${status}`);
    try {
      switch(status) {
        case config.migrationStepsTypes.unstake:
          return await doUnStake();
  
          case config.migrationStepsTypes.approved:
            if(id === config.migrationStepsTypes.migrate) {
              await doMigration();
            }
            return await doApprove();
  
        case config.migrationStepsTypes.liquidity:
          return await doMigration();
        
        default:
            return null
      }
    } catch(error) {
      console.log(error);
    } finally {
      const _currentActiveStep = await currentActiveStep();
      if(_currentActiveStep) {
        setData(prev => ({
          ...prev,
          status: _currentActiveStep
        }))
      }
    }
  }, [status, currentActiveStep, doUnStake, doApprove, doMigration]);

  const onClickHandler = useCallback(async (id) => {
    try {
      const activeStep = await currentActiveStep();
      if(!activeStep) return;
      doMigrationAction(id);
      setData(prev => ({
        ...prev,
        status: activeStep
      }));    
    } catch(error) {
      console.log(error);
    }
  }, [currentActiveStep, doMigrationAction]);

  // Set data
  useEffect(() => {
    if (!w3 || !account || !usdtusdcPlatformMigrator) return;
   
    const fetchData = async () => {
      const stakedBalance = await w3.stakingRewards["USDTLPStakingRewards"].staked(account);
      const usdtLP = w3.tokens["USDTLP"];
      const usdtLPBalance = await usdtLP.balanceOf(account);
      const govi = w3.tokens["GOVI"];
      const goviBalance = await govi.balanceOf(account);
      const activeStep = await currentActiveStep();
      setData({
        stakedBalance: fromBN(stakedBalance.stakedAmount, 18),
        usdtLPBalance: fromBN(usdtLPBalance, 18),
        goviBalance: fromBN(goviBalance, 18),
        status: !!activeStep ? config.migrationStepsTypes.start : config.migrationStepsTypes["no-need"],
      });
    };

    fetchData();
  }, [w3, account, currentActiveStep, usdtusdcPlatformMigrator]);

  useEffect(() => {
    if (status === config.migrationStepsTypes["no-need"]) return;
    setData(prev => ({...prev, userStakeAmount: usdtLPBalance}));
    setMigrationModalIsOpen(true);
  }, [setMigrationModalIsOpen, status, usdtLPBalance]);


  const checkCurrentStep = (step) => {
    switch (step) {
      case config.migrationStepsTypes.start:
        return <MigrationWelcome
            stepDetails={config.migrationSteps[0]}
            onClickHandler={onClickHandler}
            currentStep={status} />

      case config.migrationStepsTypes.unstake:
        return <Unstake
            stepDetails={config.migrationSteps[1]}
            onClickHandler={onClickHandler}
            currentStep={status}
            userStakeAmount={userStakeAmount} />

      case config.migrationStepsTypes.approved:
        return <Migrate
            stepDetails={config.migrationSteps[2]}
            onClickHandler={onClickHandler}
            currentStep={status}  />

      case config.migrationStepsTypes.liquidity:
        return <Earn stepDetails={config.migrationSteps[3]} />

      default:
        return null;
    }
  };

  return (
    <Modal className="migration-modal" closeIcon clickOutsideDisabled handleCloseModal={() => setMigrationModalIsOpen(false)}>
      {status !== config.migrationStepsTypes.start && (
        <>
          <Title
            className="migration-title"
            color="white"
            text="Migrate USDT liquidity to USDC platform"
          />
          <Steps steps={config.migrationSteps} currentStep={status} />
        </>
      )}
      {checkCurrentStep(status)}
    </Modal>
  );
};

export default MigrationModal;
