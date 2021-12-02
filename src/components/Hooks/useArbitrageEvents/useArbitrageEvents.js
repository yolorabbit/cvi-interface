import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setData, setUnfulfilledRequests } from 'store/actions/wallet';
import { useActiveWeb3React } from '../wallet';

const useArbitrageEvents = (w3, activeToken) => {
  const dispatch = useDispatch();
  const [{unfulfilledRequests, arbitrage}, events] = useSelector(({wallet, events}) => [wallet, events]);
  const { actionConfirmed } = events;
  const { account } = useActiveWeb3React();
// const account = '0xf8d74c0CF0AEBbD58401f18a1382368EB00EFc2d'

  const fetchHistory = useCallback(async () => {
    try {
      const history = await w3?.tokens[activeToken.rel.volTokenKey].getHistory({account});
      dispatch(setData("arbitrage", history));
    } catch (error) {
      console.log(error);
    }
  }, [account, activeToken?.rel?.volTokenKey, dispatch, w3?.tokens])

  const fetchUnfulfilledRequests = useCallback(async () => {
    try {
      const unfulfilledRequests = await w3?.tokens[activeToken.rel.volTokenKey].getUnfulfilledRequests({account});
      dispatch(setUnfulfilledRequests(unfulfilledRequests));
    } catch (error) {
      console.log(error);
    }
  }, [account, activeToken?.rel?.volTokenKey, dispatch, w3?.tokens]);

  useEffect(()=> {
    if(!activeToken?.rel || !account || !w3?.tokens || unfulfilledRequests) return;
    fetchUnfulfilledRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3?.tokens, account, activeToken?.rel, fetchUnfulfilledRequests]);
    
  useEffect(()=>{
    if(!activeToken?.rel || !w3?.tokens || !account || arbitrage) return;
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3?.tokens, account, activeToken?.rel, fetchHistory]);

  useEffect(() => {
    if(!actionConfirmed) return;
    fetchHistory();
    fetchUnfulfilledRequests();
  }, [actionConfirmed, fetchHistory, fetchUnfulfilledRequests])
    
  useEffect(()=>{
    if(!events || !events[activeToken?.rel?.volTokenKey] || !w3?.tokens) return;

    const getUnfulfilledRequestsById = async (requestId, lastEvent) => {
      try {
        const lastRequest = await w3?.tokens[activeToken.rel.volTokenKey].getUnfulfilledRequests({requestId, account});
        console.log(lastRequest);
        if(lastRequest?.length === 0 || !lastRequest) return;
        dispatch(setUnfulfilledRequests(lastRequest[0], true));
      } catch (error) {
        console.log(error);
      }
    }
    
    const longTokenUnfulfilledEvents = events[activeToken.rel.volTokenKey]?.SubmitRequest.events;
    if(!!longTokenUnfulfilledEvents?.length) {
      const lastEvent = longTokenUnfulfilledEvents[longTokenUnfulfilledEvents.length-1];
      getUnfulfilledRequestsById(lastEvent.requestId, lastEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events[activeToken?.rel?.volTokenKey]?.SubmitRequest?.events.length]);
}

export default useArbitrageEvents;