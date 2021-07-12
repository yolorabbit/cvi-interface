import { useContext, useMemo } from "react";
import * as TheGraph from 'graph/queries';
import { chainNames, supportedNetworksConfigByEnv } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { contractsContext } from "contracts/ContractContext";

export const bottomBlockByNetwork = {
    [chainNames.Ethereum]: 11686790,
    [chainNames.Matic]: 15129735  
}

export const DEFAULT_STEPS = 30;

export const DAY = 86400;

const EventOptionsDefaults = {
    eventsCount: Number.MAX_SAFE_INTEGER,
    blocks: Number.MAX_SAFE_INTEGER,
    stepSize: Number.MAX_SAFE_INTEGER,
    steps: 1,
    bottomBlock: 0
};

export const useEvents = () => {
    const contracts = useContext(contractsContext);
    const { selectedNetwork: chainName } = useSelector(({app}) => app);
    const {library} = useWeb3React();
    const { getBlock } = library?.eth ?? {};

    async function getEvents(eventsData, opt) {
        opt = { ...EventOptionsDefaults, ...opt };
        opt.chainName = opt.chainName ?? chainName;
        if(opt.chainName) {
            opt.bottomBlock = opt.bottomBlock ?? bottomBlockByNetwork[opt.chainName];
            if(opt.chainName === chainNames.Ethereum) {
                opt.stepSize = Number.MAX_SAFE_INTEGER;
            }
        }
        opt.events = opt.events || [];
        let to = opt.topBlock || (await getBlockCached(getBlock)).number;
        if (opt.days) opt.bottomBlock = await getBlockDaysAgo(opt.days, to, getBlock);
        let from = Math.max(to - opt.stepSize, to - opt.blocks, opt.bottomBlock);
        let pairs = [{ from, to }];
        while (opt.blocks > 0 && opt.steps > 0 && from > opt.bottomBlock) {
          opt.steps--;
          opt.blocks = opt.blocks - (to - from);
          to = from;
          from = Math.max(to - opt.stepSize, to - opt.blocks, opt.bottomBlock);
          pairs.push({ from, to });
        }
        // console.log(`pairs ${JSON.stringify(pairs.map((p) => ({ from: p.from, to: p.to, blocks: p.to - p.from })))}`);
        const promises = pairs.map((p) => getPastEvents(eventsData, p.from, p.to));
        const events = await Promise.all(promises);
        return [].concat(...events).slice(0, opt.eventsCount);
    }

    // [{ contract: token, contractName?:"USDT", events:{ Transfer: [filter]} }];
    async function getPastEvents(eventsData, fromBlock = 0, toBlock = "latest") {
        let eventList = [];
        for (const event of eventsData) {
            if (!event.contract) event.contract = contracts[event.contractName];
            for (const eventName in event.events) {
                for (const filter of event.events[eventName]) {
                    eventList.push(...(await event.contract.getPastEvents(eventName, { filter, fromBlock, toBlock })));
                }
            }
        }
        return eventList.sort((a, b) => b.blockNumber - a.blockNumber);
    } 

    
    async function getBlockCached() {
        const MAX_TIME = 0;
        let cachedBlock;
        let lastBlockFetch = 0;
        if (!cachedBlock || new Date().getTime() > lastBlockFetch + MAX_TIME) {
            cachedBlock = await getBlock("latest");
            lastBlockFetch = new Date().getTime();
        }
        return cachedBlock;
    }

    async function getBlockDaysAgo(days, from) {
        const BLOCK_RATE = chainName === chainNames.Matic ? 2 : 13.25;
        from = from ? from : (await getBlockCached(getBlock)).number;
        const blocksPerDay = DAY / BLOCK_RATE;
        return Math.floor(from - blocksPerDay * days);
    }
  
    async function getTransferEvents(staking, token, days) {
      if(chainName === chainNames.Matic) {
        const _events = await TheGraph.collectedFees();
        return _events.collectedFees;
      } 
      let isETH = false;
      if (token._address.toLowerCase() === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") isETH = true;
      let options = {};
      const latestBlockNumber = await (await getBlock("latest")).number;
      const stepSize = latestBlockNumber - bottomBlockByNetwork[chainName]
      options = { days, stepSize: (parseInt(stepSize / DEFAULT_STEPS) + 1000), steps: DEFAULT_STEPS }
      const filter = { [isETH ? "dst" : "to"]: staking._address };
      const eventsData = [{ contract: token, events: { Transfer: [filter] } }];
      return await getEvents(eventsData, options, getBlock);
    }

    async function getLastOpenEvent(account, platform) {
        try {
            if(config.isMainnet) {
                let _lastOpenEvent = await TheGraph.lastOpen(account, platform._address);
                return !!_lastOpenEvent.openPositions?.length ? _lastOpenEvent.openPositions[0] : null;
            }
            const latestBlockNumber = await (await getBlock("latest")).number;
            
            const stepSize = latestBlockNumber - bottomBlockByNetwork[chainName];
            const options = {eventsCount: 1, stepSize, days: 30 };
            const eventsData = [{ contract: platform, events: { OpenPosition: [{ account }] } }];
            const events = await getEvents(eventsData, options, getBlock);
            return events[events.length - 1];
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    const getLatestBlockTimestamp = async() => (await getBlock("latest")).timestamp

    const localTimestamp = () => {
        return Math.floor(new Date().getTime() / 1000);
    };

    async function getNow(forceSync = true) {
        let diff;
        if (forceSync || !diff) {
            let timestamp = parseInt((await getBlockCached(getBlock)).timestamp);
            diff = timestamp - localTimestamp();
            return timestamp;
        }
        return localTimestamp() + diff;
    }

    return useMemo(()=> {
        if(!library) return null;
        return {
            getEvents, 
            getTransferEvents, 
            getPastEvents, 
            getNow, 
            getLatestBlockTimestamp,
            getLastOpenEvent
        }
      // eslint-disable-next-line
    },[]);
}