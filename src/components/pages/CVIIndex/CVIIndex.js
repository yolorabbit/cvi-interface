import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Chart from 'kaktana-react-lightweight-charts';
import Column from 'components/Layout/Column';
import Container from 'components/Layout/Container';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import { Loading, Error } from './HelperComponents';
import config from '../../../config/config';
import options from './chartOptions.js';
//TODO: create a dedicated css data - right now taken from staking component
import '../Staking/Staking.scss';


const CVIIndex = () => { // @TODO: use Amir new api for fetching history
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  const mergeData = apiResults => {
    //reverse and fix date
    apiResults = apiResults.reverse().map(i => ([i[0]*1000, i[1]]));
    //merge with historical data
    let mergedData = [...apiResults]; 
    //convert API result to TV LineSeries: https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/line-series.md#customization
    mergedData = mergedData.map(item => ({
      time: moment(item[0]).format('YYYY-MM-DD'), 
      value: item[1]
    }));
    //remove duplicate dates - first of every day is kept!
    //TODO: better logic
    let s = new Set(), result = [];
    mergedData.forEach(item => {
      if(!s.has(item.time)) {
        s.add(item.time);
        result.push(item);
      }
    });
    return result;    
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(config.routes.cviindex.dataUrl);
        const result = await response.json();
        const lineSeries = mergeData(result);
        setData([{data: lineSeries}]);
      }
      catch(err) {
        console.error(err);
        setError('Couldn\'t get API results');
      }
    };
    getHistory();
  }, [])

  return (
    <Layout className="staking-component">
      <Column>
        <Row>
          <Container title="CVI Index">
          {
            error ?
              <Error message={error}/>
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
                    <Loading />
                }
              </>
          }
          </Container>
        </Row>
      </Column>
    </Layout>
  );
}

export default CVIIndex;
