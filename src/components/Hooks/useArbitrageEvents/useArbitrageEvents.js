import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setData, setUnfulfilledRequests } from 'store/actions/wallet';
import { useActiveWeb3React } from '../wallet';

const useArbitrageEvents = (w3, activeToken) => {
  const dispatch = useDispatch();
  const [{unfulfilledRequests, arbitrage}, events] = useSelector(({wallet, events}) => [wallet, events]);
  const { account } = useActiveWeb3React();

  useEffect(()=> {
    if(!activeToken?.rel || !account || !w3?.tokens) return;

    const fetchUnfulfilledRequests = async () => {
      const unfulfilledRequests = await w3?.tokens[activeToken.rel.contractKey].getUnfulfilledRequests({account});
      dispatch(setUnfulfilledRequests(unfulfilledRequests))
    }

    if(!unfulfilledRequests) {
      fetchUnfulfilledRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3?.tokens, account, activeToken?.rel]);
    
  useEffect(()=>{
    if(!activeToken?.rel || !w3?.tokens) return;
    
    const fetchHistory = async () => {
      const history = await w3?.tokens[activeToken.rel.contractKey].getHistory({account});
      dispatch(setData("arbitrage", history));
    }
    if(!arbitrage && account && w3?.tokens) {
      fetchHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3?.tokens, account, activeToken?.rel]);
    
  useEffect(()=>{
    if(!events || !events[activeToken?.rel?.contractKey] || !w3?.tokens) return;

    const getUnfulfilledRequestsById = async (requestId, lastEvent) => {
      const lastRequest = await w3?.tokens[activeToken.rel.contractKey].getUnfulfilledRequests({requestId, account});
      console.log(lastRequest);
      dispatch(setUnfulfilledRequests(lastRequest[0], true))
    }
    
    const longTokenUnfulfilledEvents = events[activeToken.rel.contractKey]?.SubmitRequest.events;
    if(!!longTokenUnfulfilledEvents?.length) {
      const lastEvent = longTokenUnfulfilledEvents[longTokenUnfulfilledEvents.length-1];
      getUnfulfilledRequestsById(lastEvent.requestId, lastEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events[activeToken?.rel?.contractKey]?.SubmitRequest?.events.length]);
}

export default useArbitrageEvents;