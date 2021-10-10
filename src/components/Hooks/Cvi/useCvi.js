import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import Api from "Api";
import { useDispatch, useSelector } from "react-redux";
import { setVolInfo, updateVolInfo } from "store/actions";
import { customFixed } from "utils";
import { chainNames } from "connectors";
import { debounce } from "lodash";
import config from "config/config";

export const getPercentageChange = (oldNumber, newNumber) => {
   const decreaseValue = oldNumber - newNumber;
   return (decreaseValue / oldNumber) * 100;
}

const useCvi = () => {
   const dispatch = useDispatch();
   const interval = useRef();
   const { cviVolInfo, ethVolInfo, series } = useSelector(({app}) => app.indexInfo);
   const { selectedNetwork } = useSelector(({app}) => app);
   const [timeDuration, setTimeDuration] = useState();

   const mappedIndexData = (key, {index, oneHourAgo, oneDayChange, oneDayChangePercent, oneWeekHigh, oneWeekLow, timestamp}) => {
      return {
         key,
         time: moment.utc(timestamp * 1000).format("LLL"),
         index: customFixed(index, 2),
         oneDayChange: customFixed(oneDayChange, 2),
         oneDayChangePercent: customFixed(oneDayChangePercent, 2),
         oneHourAgo: customFixed(oneHourAgo, 2),
         cviOneWeekHigh: customFixed(oneWeekHigh, 2),
         cviOneWeekLow: customFixed(oneWeekLow, 2),
         lastHoursIndex: 970
      }
   }

   const startPollingInterval = () => {
      const nextUpdateOnMinutes = selectedNetwork === chainNames.Matic ? 21 : 62;
      const now = moment.utc();
      const pollingTime = ((nextUpdateOnMinutes - (now.minute() % nextUpdateOnMinutes))) * 60 * 1000;
      setTimeDuration(pollingTime);
   }

   const fetchGraphData = async () => {
      try {
         const chainName = selectedNetwork === chainNames.Matic ? 'Polygon' : chainNames.Ethereum;
         const { data: hourlySeries } = await Api.GET_INDEX_HISTORY(chainName); // @TODO: use different series for ethvol
         const { data: dailyHistory } = await Api.GET_FULL_DAILY_HISTORY(); // @TODO: use different series for ethvol
         const sortedHourlySeries = hourlySeries.map(serie => ([serie[0] * 1000, serie[1]])).sort((a,b)=> a[0] - b[0])
         const sortedDailySeries = dailyHistory.sort((a,b)=> a[0] - b[0]) // sort and mul seconds to miliseconds

         dispatch(updateVolInfo({
            history: {
               daily: sortedDailySeries,
               hourly: sortedHourlySeries
            }
         }, config.volatilityKey.cvi));

         dispatch(updateVolInfo({ // @TODO: update details to ethvol
            history: {
               daily: sortedDailySeries,
               hourly: sortedHourlySeries
            }
         }, config.volatilityKey.ethvol));

      } catch(error) {
         console.log(error);
      }
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
         const { data: volInfo } = await Api.GET_VOL_INFO(chainName);
         
         fetchGraphData();

         if(volInfo?.data?.CVI) {
            dispatch(setVolInfo({
               cviVolInfo: mappedIndexData('cvi', volInfo.data.CVI)
            }));
         }

         if(volInfo?.data?.ETHVOL) {
            dispatch(setVolInfo({
               ethVolInfo: selectedNetwork === chainNames.Matic ? null : mappedIndexData('ethvol', volInfo.data.ETHVOL)
            }));
         }
      } catch (error) {
            console.log(error);
      }
   }, [contracts]);

   const getDataDebounce = useMemo(
      () => debounce(getData, 750)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   , []);

   useEffect(()=> {
      if(!selectedNetwork) return;
      startPollingInterval();
      getDataDebounce();

      return () => {
         getDataDebounce.cancel();
      }
      //eslint-disable-next-line
   }, [selectedNetwork]);


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
         if(!cviVolInfo || !ethVolInfo || !series) return {};
         return {
               cviVolInfo,
               ethVolInfo,
               series,
         }
      } catch (error) {   
            console.error('Failed to get cvi info', error)
            return {}
        }// eslint-disable-next-line
    }, [cviVolInfo, series])
}

export default useCvi;