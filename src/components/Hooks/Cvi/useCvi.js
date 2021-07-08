import { useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import Api from "Api";
import { useDispatch, useSelector } from "react-redux";
import { setCviInfo } from "store/actions";
import { useContext } from "react";
import { useInDOM } from "..";
import { customFixed, toDisplayAmount } from "utils";
import config from "config/config";
import { contractsContext } from "contracts/ContractContext";

export const getPercentageChange = (oldNumber, newNumber) => {
   const decreaseValue = oldNumber - newNumber;
   return (decreaseValue / oldNumber) * 100;
}

const getVolatilityInfo = (oldNumber, newNumber) => { 
   return {
       price: customFixed(newNumber, 2),
       lastTimeChange: customFixed((newNumber - oldNumber), 2),
       lastTimeChangePrecentage: customFixed(getPercentageChange(newNumber, oldNumber), 2)
   }
}

const calculateCviInfo = ({data, cviValue, lastHours = 24}) => {
   try {
       const dataIndex = 1; // cvi index

       const _lastHour = data[data.length-1];
       
       const cviData = {
           time: moment.utc(_lastHour[0]).format("LLL"),
           price: cviValue ? toDisplayAmount(cviValue, 2) : _lastHour[dataIndex]
       }
   
       const _last2Hour = data[data.length-2];
   
       const _lastXHours = data[data.length-(lastHours+1)];
   
       cviData.previousHours = customFixed(_lastXHours[dataIndex], 2);
   
       cviData.previousHour = customFixed(_last2Hour[dataIndex], 2);
       
       cviData.lastTimeChange = customFixed((cviData.price - _lastXHours[dataIndex]), 2);
       
       cviData.lastTimeChangePrecentage = customFixed(getPercentageChange(cviData.price, _lastXHours[dataIndex]), 2);
       
       const pricesArray = data.slice(data.length-1-(lastHours*7),data.length).map(d => d[dataIndex]);
       
       cviData.periodLow = customFixed(Math.min(...pricesArray), 2);
       
       cviData.periodHigh = customFixed(Math.max(...pricesArray), 2);

       cviData.lastHoursIndex = data.length - lastHours;

       cviData.price = customFixed(cviData.price, 2);
       
       return cviData;
   } catch(error) {
      console.log(error);
      return null;
   }
}

const useCvi = () => {
   const isActiveInDOM = useInDOM();
   const dispatch = useDispatch();
   const interval = useRef();
   const [isProcessing, setIsProcessing] = useState();
   const contracts = useContext(contractsContext);
   const { cviInfo, series } = useSelector(({app}) => app.cviInfo);
   const { selectedNetwork } = useSelector(({app}) => app);
   const [timeDuration, setTimeDuration] = useState(); // next hour + 2 minutes
   
   useEffect(() => {
      const startOfHourPlus2Minutes = moment.utc().startOf('hour').add(2, "minutes");
      if(startOfHourPlus2Minutes.isAfter(moment.utc())) {
         setTimeDuration(startOfHourPlus2Minutes.diff(moment.utc()));
      } else {
         setTimeDuration((moment.utc().endOf("hour").diff(moment.utc())) + 120000);
      }
   }, []);

   const calculateVolatilityData = (newData, oldData) => {
      dispatch(setCviInfo({
         btcVolatilityInfo: getVolatilityInfo(oldData[config.cviInfoCurrencyIndex['BTC']], newData[config.cviInfoCurrencyIndex['BTC']]),
         ethVolatilityInfo: getVolatilityInfo(oldData[config.cviInfoCurrencyIndex['ETH']], newData[config.cviInfoCurrencyIndex['ETH']])
      }));
   }

   const getData = async () => {
      try {
            const { data = {} } = await Api.GET_INDEX_HISTORY();
           
            if(data.cvixData) {
               calculateVolatilityData(
                  data.cvixData?.[data.cvixData.length - 1], 
                  data.cvixData?.[data.cvixData.length - 25]
               );

               let cviValue;
   
               try {
                  const { getCVILatestRoundData } = contracts[config.contractsMapped[selectedNetwork].CVIOracle].methods;
                  const _data = await getCVILatestRoundData().call();
                  cviValue = _data.cviValue;
               } catch(error) {
                     console.log(error);
               }

               data.cvixData = data.cvixData.sort((a,b)=> a[0] - b[0]);
               await _setCviInfo(data.cvixData, cviValue);
            }
      } catch (error) {
            console.log(error);
      }
   }   

   const _setCviInfo = async (data, cviValue) => {
      try {
         const cviInfo = calculateCviInfo({ data, cviValue });
         dispatch(setCviInfo({
            cviInfo,
            series: data
         }));
      } catch(error) {
         console.log(error);
      } finally {
         if(isActiveInDOM()) {
            setIsProcessing(false);
         }
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