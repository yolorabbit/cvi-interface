import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import Api from "Api";
import { useDispatch, useSelector } from "react-redux";
import { updateVolInfo } from "store/actions";
import { customFixed, toDisplayAmount } from "utils";
import { chainNames } from "connectors";
import { debounce } from "lodash";
import config from "config/config";
import { contractsContext } from "contracts/ContractContext";
import { getCviValue } from "contracts/utils";

export const getPercentageChange = (oldNumber, newNumber) => {
   const decreaseValue = oldNumber - newNumber;
   return (decreaseValue / oldNumber) * 100;
}

const useCvi = () => {
   const dispatch = useDispatch();
   const interval = useRef();
   const { cviVolInfo, ethVolInfo } = useSelector(({app}) => app.indexInfo);
   const { selectedNetwork } = useSelector(({app}) => app);
   const [timeDuration, setTimeDuration] = useState();
   const contracts = useContext(contractsContext);
   
   const getIndexFromOracle = useCallback(async (type) => {
      try {
         if(!contracts) return null;
         const value = await getCviValue(contracts[type]);
         return value === "N/A" ? null : value;
      } catch(error) {
         console.log(error);
      }
   }, [contracts]);

   const mappedIndexData = (key, customIndex, {index, oneHourAgo, oneDayChange, oneDayChangePercent, oneWeekHigh, oneWeekLow, timestamp}) => {
      return {
         key,
         time: moment.utc(timestamp * 1000).format("LLL"),
         index: customIndex ? toDisplayAmount(customIndex, 2) : customFixed(index, 2),
         oneDayChange: customFixed(oneDayChange, 2),
         oneDayChangePercent: customFixed(oneDayChangePercent, 2),
         oneHourAgo: customFixed(oneHourAgo, 2),
         cviOneWeekHigh: customFixed(oneWeekHigh, 2),
         cviOneWeekLow: customFixed(oneWeekLow, 2),
         lastHoursIndex: 970,
         [`${key}ApiV2`]: index,
         [`${key}Oracle`]: customIndex,
      }
   }

   const startPollingInterval = () => {
      const nextUpdateOnMinutes = selectedNetwork === chainNames.Matic ? 21 : 62;
      const now = moment.utc();
      const pollingTime = ((nextUpdateOnMinutes - (now.minute() % nextUpdateOnMinutes))) * 60 * 1000;
      setTimeDuration(pollingTime);
   }

   const fetchGraphData = useCallback(async (index = "CVI") => {
         try {
            const chainName = selectedNetwork === chainNames.Matic ? 'Polygon' : chainNames.Ethereum;
            const { data: hourlySeries } = await Api.GET_INDEX_HISTORY({chainName, index}); 
            const { data: dailyHistory } = await Api.GET_FULL_DAILY_HISTORY({chainName, index}); 
            const sortedHourlySeries = hourlySeries.map(serie => ([serie[0] * 1000, serie[1]])).sort((a,b)=> a[0] - b[0])
            const sortedDailySeries = dailyHistory.sort((a,b)=> a[0] - b[0])
            
            dispatch(updateVolInfo({
               history: {
                  daily: sortedDailySeries,
                  hourly: sortedHourlySeries
               }
            }, index === "CVI" ? config.volatilityKey.cvi : config.volatilityKey.ethvol));
         } catch(error) {
            console.log(error);
         }
      }, [dispatch, selectedNetwork],
   )

   const fetchVolData = useCallback(async () => {
      try {
         fetchGraphData("CVI");
         fetchGraphData("ETHVOL");

         const chainName = selectedNetwork === chainNames.Matic ? 'Polygon' : chainNames.Ethereum;
         const { data: volInfo } = await Api.GET_VOL_INFO(chainName);
         const cviIndex = await getIndexFromOracle(config.oracles.cvi);

         let volData = {
            cviVolInfo: volInfo?.data?.CVI ?  mappedIndexData('cvi', cviIndex, volInfo?.data?.CVI) : null,
            ethVolInfo: null
         }

         if(selectedNetwork === chainNames.Ethereum) {
            const customETHVOL = await getIndexFromOracle("ETHVolOracle");
            volData.ethVolInfo = volInfo?.data?.ETHVOL ? mappedIndexData('ethvol', customETHVOL, volInfo?.data?.ETHVOL) : null
         }

         dispatch(updateVolInfo(volData.cviVolInfo, config.volatilityKey.cvi));
         dispatch(updateVolInfo(volData.ethVolInfo, config.volatilityKey.ethvol));
      } catch (error) {
            console.log(error);
      }
   }, [dispatch, fetchGraphData, getIndexFromOracle, selectedNetwork]);

   const getDataDebounce = useMemo(
      () => debounce(fetchVolData, 750)
   , [fetchVolData]);

   useEffect(()=> {
      if(!selectedNetwork || !contracts) return;
      startPollingInterval();
      getDataDebounce();

      return () => {
         getDataDebounce.cancel();
      }
      //eslint-disable-next-line
   }, [selectedNetwork, contracts]);


   useEffect(() => {
      if(!selectedNetwork) return;
      interval.current = setInterval(() => {
            if(timeDuration) {
               getDataDebounce();
               startPollingInterval();
            }
      }, timeDuration);
      return () => interval.current && clearInterval(interval.current);
   //eslint-disable-next-line
   }, [timeDuration, selectedNetwork]);


    return useMemo(() => {
      try {
         if(!cviVolInfo || !ethVolInfo) return {};
         return {
               cviVolInfo,
               ethVolInfo,
         }
      } catch (error) {   
            console.error('Failed to get cvi info', error)
            return {}
        }// eslint-disable-next-line
    }, [cviVolInfo, ethVolInfo])
}

export default useCvi;