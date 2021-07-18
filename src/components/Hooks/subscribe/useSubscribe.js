import { contractsContext } from "contracts/ContractContext";
import { useContext, useEffect, useState } from "react";
import { useActiveWeb3React } from "../wallet";


const useSubscribe = (assets) => {

    const {library: web3} = useActiveWeb3React();
    const [subscribedEvents,  setSubscribedEvents] = useState({});
    const contracts = useContext(contractsContext);

    const subscribeLogEvent = () => {
        assets.forEach(({name, events} )=> {
            try {
                const contract = contracts[name];
                if(!contract) return;
                events.forEach(eventName => {
                    const eventJsonInterface = web3.utils._.find(
                        contract._jsonInterface,
                        o => o.name === eventName && o.type === 'event',
                    )
                    const subscription = web3.eth.subscribe('logs', {
                        address: contract.options.address,
                        topics: [eventJsonInterface.signature]
                    }, (error, result) => {
                        if (!error) {
                            const eventObj = web3.eth.abi.decodeLog(
                                eventJsonInterface.inputs,
                                result.data,
                                result.topics.slice(1)
                            )
                            console.log(`New ${eventName} of ${name}!`, eventObj)
                        }
                    })
                    setSubscribedEvents(prev => ({
                        ...prev,
                        [name]: {
                            ...prev[name],
                            [eventName]: subscription
                        }
                    }))
                    console.log(`subscribed to event '${eventName}' of contract '${name}' `)
                });
            } catch (error) {
                console.log(error);
                console.log(name);
            }
        });
    
    }
    
    useEffect(() =>{
        return () => {
            const events = Object.values(Object.values(subscribedEvents));
            events.forEach((subs) => {
                Object.values(subs).forEach((sub)=>{
                    sub.unsubscribe(function(error, success){
                        if(error) console.log("error: ", error);
                        if(success)
                            console.log('Successfully unsubscribed!');
                    });
                })
            }) 
        }
    },[subscribedEvents])

    useEffect(() => {
        if(!contracts) return
        subscribeLogEvent();
        // eslint-disable-next-line
    }, [contracts]);

    return null
}

export default useSubscribe;
