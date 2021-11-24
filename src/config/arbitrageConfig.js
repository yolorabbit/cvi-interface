
export const activeViews = {
  "pending": "pending",
  "history": "history"
}

const tabs = {
  "sub-navbar": {
      "mint": "Mint",
      "burn": "Burn"
  }
};

const arbitrageConfig = {
  tabs,
  headers: {
    "stats": { 
      "Index": {
        label: "Index"
      }, 
      "Platform Price": {
        label: "Platform Price",
      }, 
      "Open positions": {
        label: "Uniswap Price",
      }, 
    }
  },
}

export default arbitrageConfig;