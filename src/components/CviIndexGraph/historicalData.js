import moment from 'moment';
import historical from './historicalData.json';

export const mappedSeriesData = (series) => {
    if (!series?.length) return;
    const lastHistoryDate = moment.utc(historicalData[historicalData.length -1][0]).format('l');
    const findIndex = series.findIndex((item) => {
        return moment.utc(item[0]).format('l') === lastHistoryDate;
    });

    if(findIndex > 0) {
        series = series.slice(findIndex+1, series.length-1); 
        historicalData = historicalData.slice(0, historicalData.length-2)
    }

    const result = [];
    let lastDate = moment.utc(series[series.length - 1][0]).format("l");
   
    for (let i = 0; i < series.length; i = i + 24) {
        if (i % 24 === 0) {
            result.push(series[i]);
        }
    }

    if (moment.utc(result[result.length - 1][0]).format('l') !== lastDate) {
        result.push(series[series.length - 1]);
    }

    if (!result.length > 0) return historicalData;

    const diffDays = moment.duration(moment.utc(historicalData[historicalData.length - 1][0]).diff(moment.utc(result[0][0]))).days();
    const slicedData = historicalData.slice(0, ((historicalData.length - 2) - diffDays));
    const resultConcat = slicedData.concat(result);

    return resultConcat;
}

export let historicalData = historical;
