import { useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import Api from "Api";
import { useDispatch, useSelector } from "react-redux";
import { setCviInfo } from "store/actions";
import { customFixed } from "utils";
import { chainNames } from "connectors";
import { debounce } from "lodash";

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

   const startPollingInterval = () => {
      const nextUpdateOnMinutes = selectedNetwork === chainNames.Matic ? 21 : 62;
      const now = moment.utc();
      const pollingTime = ((nextUpdateOnMinutes - (now.minute() % nextUpdateOnMinutes))) * 60 * 1000;
      setTimeDuration(pollingTime);
   }

   const mappedCviData = (key, {index, oneHourAgo, oneDayChange, oneDayChangePercent, oneWeekHigh, oneWeekLow, timestamp}) => {
      return {
         key,
         timestamp,
         [key]: customFixed(index, 2),
         [`${key}OneDayChange`]: customFixed(oneDayChange, 2),
         [`${key}OneDayChangePercent`]: customFixed(oneDayChangePercent, 2),
         [`${key}OneHourAgo`]: customFixed(oneHourAgo, 2),
         [`${key}OneWeekHigh`]: customFixed(oneWeekHigh, 2),
         [`${key}OneWeekLow`]: customFixed(oneWeekLow, 2),
         lastHoursIndex: 970
      }
   }

   const getData = async () => {
      try {
         const chainName = selectedNetwork === chainNames.Matic ? 'Polygon' : chainNames.Ethereum;
         const { data: series } = await Api.GET_INDEX_HISTORY(chainName);
         const { data: latestRoundInfo } = await Api.GET_INDEX_LATEST(chainName);
         
         if(series || latestRoundInfo?.data?.CVI) {
            const sortedCviSeries = series.map(serie => ([serie[0] * 1000, serie[1]])).sort((a,b)=> a[0] - b[0]) // sort and mul seconds to miliseconds
            
            let cviData = {
               cviInfo: mappedCviData('cvi', latestRoundInfo?.data?.CVI),
               ethVolInfo: mappedCviData('ethvol', latestRoundInfo?.data?.ETHVOL),
               series: sortedCviSeries
            }
            
            dispatch(setCviInfo(cviData));
         }
      } catch (error) {
         console.log(error);
      }
   }   
   
   const getDataDebounce = useMemo(
      () => debounce(getData, 750)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   , []);

   useEffect(() => {
      if(!selectedNetwork) return;
      startPollingInterval();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedNetwork]);

   useEffect(()=> {
      if(!selectedNetwork) return;
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