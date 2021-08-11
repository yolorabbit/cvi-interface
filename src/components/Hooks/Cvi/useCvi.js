import { useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import Api from "Api";
import { useDispatch, useSelector } from "react-redux";
import { setCviInfo } from "store/actions";
import { useContext } from "react";
import { contractsContext } from "contracts/ContractContext";
import { customFixed, toDisplayAmount } from "utils";

export const getPercentageChange = (oldNumber, newNumber) => {
   const decreaseValue = oldNumber - newNumber;
   return (decreaseValue / oldNumber) * 100;
}

const useCvi = () => {
   const dispatch = useDispatch();
   const interval = useRef();
   const [isProcessing, setIsProcessing] = useState();
   const contracts = useContext(contractsContext);
   const [timeDuration, setTimeDuration] = useState(); // next hour + 2 minutes
   const { cviInfo: appCviInfo } = useSelector(({app}) => app);
   const  { cviInfo, series } = appCviInfo;

   useEffect(() => {
      const startOfHourPlus2Minutes = moment.utc().startOf('hour').add(2, "minutes");
      if(startOfHourPlus2Minutes.isAfter(moment.utc())) {
         setTimeDuration(startOfHourPlus2Minutes.diff(moment.utc()));
      } else {
         setTimeDuration((moment.utc().endOf("hour").diff(moment.utc())) + 120000);
      }
   }, []);


   const getData = async () => {
      try {
         const { data: series } = await Api.GET_INDEX_HISTORY();
         const { data: latestRoundInfo } = await Api.GET_INDEX_LATEST();
           
         if(series || latestRoundInfo) {
            const sortedCviSeries = series.map(serie => ([serie[0] * 1000, serie[1]])).sort((a,b)=> a[0] - b[0]) // sort and mul seconds to miliseconds
            
            let cviData = {
               cviInfo: Object.keys(latestRoundInfo).reduce((old, key) => ({
                  ...old,
                  [key]: customFixed(latestRoundInfo[key], 2)
               }), {}),
               series: sortedCviSeries
            }

            try {
               const { getCVILatestRoundData } = contracts["CVIOracle"].methods;
               const _data = await getCVILatestRoundData().call();
               cviData.cviInfo.value = toDisplayAmount(_data.cviValue, 2);
            } catch(error) {
               console.log(error);
            }  

            dispatch(setCviInfo(cviData));
         }
      } catch (error) {
         console.log(error);
      }
   }   

   useEffect(()=> {
      if(!contracts || cviInfo || series.length) return;
      if(!isProcessing) {
         getData();
         setIsProcessing(true);
      }
      //eslint-disable-next-line
   }, [contracts]);

   useEffect(() => {
      interval.current = setInterval(() => {
            if(timeDuration) {
               getData();
               setTimeDuration((moment.utc().endOf("hour").diff(moment.utc())) + 120000); // next hour + 2 minutes
            }
      }, timeDuration);
      return () => interval.current && clearInterval(interval.current);
   //eslint-disable-next-line
   }, [timeDuration]);


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