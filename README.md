Run Project

1. Create file .env locally: (do not add it to Git)

```
SASS_PATH=./node_modules;./src
REACT_APP_HOST_V2=https://api-v2.cvi.finance
REACT_APP_DAYS_TO_COUNT_FROM=4
REACT_APP_ENVIRONMENT="mainnet"
GENERATE_SOURCEMAP=false
```

2. `yarn install`

You need to login to Coti-private-npm-registry to be able to install some of the dependencies of this project.

3. `yarn start`