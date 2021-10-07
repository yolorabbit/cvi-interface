import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import Api from "Api";
import { useDispatch, useSelector } from "react-redux";
import { setCviInfo } from "store/actions";
import { customFixed, toDisplayAmount } from "utils";
import { chainNames } from "connectors";
import { debounce } from "lodash";
import { getCviValue } from "contracts/utils";
import { contractsContext } from "contracts/ContractContext";

export const getPercentageChange = (oldNumber, newNumber) => {
   const decreaseValue = oldNumber - newNumber;
   return (decreaseValue / oldNumber) * 100;
}

const useCvi = () => {
   const dispatch = useDispatch();
   const interval = useRef();
   const [timeDuration, setTimeDuration] = useState(); // next hour + 2 minutes
   const { cviInfo: appCviInfo, selectedNetwork } = useSelector(({app}) => app);
   const { cviInfo, series } = appCviInfo;
   const contracts = useContext(contractsContext);

   const startPollingInterval = () => {
      const nextUpdateOnMinutes = selectedNetwork === chainNames.Matic ? 21 : 62;
      const now = moment.utc();
      const pollingTime = ((nextUpdateOnMinutes - (now.minute() % nextUpdateOnMinutes))) * 60 * 1000;
      setTimeDuration(pollingTime);
   }

   const mappedCviData = (key, customIndex, {index, oneHourAgo, oneDayChange, oneDayChangePercent, oneWeekHigh, oneWeekLow, timestamp}) => {
      return {
         key,
         timestamp,
         [key]: customIndex ? toDisplayAmount(customIndex, 2) : customFixed(index, 2),
         [`${key}OneDayChange`]: customFixed(oneDayChange, 2),
         [`${key}OneDayChangePercent`]: customFixed(oneDayChangePercent, 2),
         [`${key}OneHourAgo`]: customFixed(oneHourAgo, 2),
         [`${key}OneWeekHigh`]: customFixed(oneWeekHigh, 2),
         [`${key}OneWeekLow`]: customFixed(oneWeekLow, 2),
         [`${key}ApiV2`]: index,
         [`${key}Oracle`]: customIndex,
         lastHoursIndex: 970
      }
   }

   const fetchGraphData = useCallback(async () => {
      try {
         const chainName = selectedNetwork === chainNames.Matic ? 'Polygon' : chainNames.Ethereum;
         const { data: hourlySeries } = await Api.GET_INDEX_HISTORY(chainName); // @TODO: use different series for ethvol
         const { data: dailyHistory } = await Api.GET_FULL_DAILY_HISTORY(chainName); // @TODO: use different series for ethvol
         const sortedHourlySeries = hourlySeries.map(serie => ([serie[0] * 1000, serie[1]])).sort((a,b)=> a[0] - b[0])
         const sortedDailySeries = dailyHistory.sort((a,b)=> a[0] - b[0]) // sort and mul seconds to miliseconds
         
         
         // merged daily and history
         // const firstHourlyDate = moment(sortedHourlySeries[0][0]).utc(); 
         // const lastHourlyDate = moment(sortedHourlySeries[sortedHourlySeries.length - 1][0]).utc();
         // const diffDays = lastHourlyDate.diff(firstHourlyDate, 'days');
         // const slicedDailySeries = sortedDailySeries.slice(0, (sortedDailySeries.length - 1) - diffDays)
         
         // const mergedDailyAndHourly = slicedDailySeries.concat(sortedHourlySeries).sort((a,b)=> a[0] - b[0]);
         return {series: sortedHourlySeries, historicalData: sortedDailySeries};
      } catch(error) {
         console.log(error);
      }
   }, [selectedNetwork])

   const getIndexFromOracle = useCallback(async (type) => {
      try {
         return await getCviValue(contracts[type]);
      } catch(error) {
         console.log(error);
      }
   }, [contracts]);

   const getData = useCallback(async () => {
      
      try {
         const chainName = selectedNetwork === chainNames.Matic ? 'Polygon' : chainNames.Ethereum;
         const {series, historicalData} = await fetchGraphData();
         dispatch(setCviInfo({
            series,
            historicalData
         }));
         
         const { data: latestRoundInfo } = await Api.GET_INDEX_LATEST(chainName);
         const customIndex = await getIndexFromOracle("CVIOracle");
         const customETHVol = await getIndexFromOracle("ETHVolOracle");
         
         const cviData = {
            cviInfo: latestRoundInfo?.data?.CVI ?  mappedCviData('cvi', customIndex, latestRoundInfo?.data?.CVI) : null,
            ethVolInfo: latestRoundInfo?.data?.ETHVOL ? mappedCviData('ethvol', customETHVol, latestRoundInfo?.data?.ETHVOL) : null,
         }
         
         dispatch(setCviInfo(cviData));
      } catch (error) {
         console.log(error);
      }
   }, [dispatch, fetchGraphData, getIndexFromOracle, selectedNetwork])  
   
   const getDataDebounce = useMemo(
      () => debounce(getData, 750)
   , [getData]);

   useEffect(() => {
      if(!selectedNetwork) return;
      startPollingInterval();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedNetwork]);

   useEffect(()=> {
      if(!selectedNetwork || !contracts) return;
      getDataDebounce();

      return () => {
         getDataDebounce.cancel();
      }
      //eslint-disable-next-line
   }, [selectedNetwork, contracts]);

   useEffect(() => {
      if(!selectedNetwork || !contracts) return;
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
         if(!cviInfo || !series) return {};
         return {
            cviInfo,
            series,
         }
      } catch (error) {   
            console.error('Failed to get cvi info', error)
            return {}
        }// eslint-disable-next-line
    }, [cviInfo, series])
}

export default useCvi;