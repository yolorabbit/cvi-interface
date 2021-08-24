import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Chart from 'kaktana-react-lightweight-charts';
import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import config from '../../../config/config';
import historicalData from '../../CviIndexGraph/historicalData.json';
import '../Staking/Staking.scss';

const options = {
  color: '#f48fb1',
  lineStyle: 0,
  lineWidth: 1,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 6,
  lineType: 1
};

const CVIIndex = () => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(false);

  const mergeData = apiResults => {
    //reverse and fix date
    apiResults = apiResults.reverse().map(i => ([i[0]*1000, i[1]]));
    //merge with historical data
    let mergedData = [...historicalData, ...apiResults];
    //convert API result to TV LineSeries: https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/line-series.md#customization
    mergedData = mergedData.map(item => ({
      time: moment(item[0]).format('YYYY-MM-DD'), 
      value: item[1]
    }));
    //TODO: remove duplicate dates?
    let s = new Set(), result = [];
    mergedData.forEach(item => {
      if(!s.has(item.time)) {
        s.add(item.time);
        result.push(item);
      }
    });
    console.log(mergedData.length, result.length);
    return result;    
  }

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(config.routes.cviindex.dataUrl);
        const result = await response.json();
        const lineSeries = mergeData(result);
        console.log(lineSeries);
        setData([{data: lineSeries}]);
      }
      catch(err) {
        console.error(err);
        setError(true);
      }
    };
    getHistory();
  }, [])

  return (
    <Layout className="staking-component">
      <Column>
        <Row>
          <Container title="CVI Index">
            <>
              {
                error ?
                  <Container title="Error occured" style={{background: 'red', text: 'white'}}>
                    Error occured while getting CVI index data
                  </Container>
                :
                  <>
                    {
                      data ?
                        <div style={{padding: '5px'}}>
                          <Chart
                            options={options}
                            lineSeries={data}
                            darkTheme
                            height={350}
                            autoWidth 
                          />
                        </div>  
                      :
                        <div>Loading...</div>
                    }
                  </>
              }
            </>
     
          </Container>
        </Row>
      </Column>
    </Layout>
  );
}

export default CVIIndex;
