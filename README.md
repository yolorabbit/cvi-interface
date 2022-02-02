# Links

1. Staging - https://staging.cvi.finance/
2. Silent - https://silent.cvi.finance/
3. Production - https://cvi.finance/

# Jira 

https://creditcoin.atlassian.net/jira/software/c/projects/CVIX/boards/56

# Run Project Locally

1. `yarn install`

You need to login to `coti-cvi` private-npm-registry to be able to install some of the dependencies of this project:

```
npm login
username: <your npm username>
password: <your password (not your token)>
email: <your email which is linked to your username>
auth: <check your email for verification code>
```

### To start the web on staging env:

Create `.env` file:

```
REACT_APP_HOST=https://api-dev.cvx.finance
REACT_APP_HOST_V2=https://staging-api-v2.cvi.finance
REACT_APP_COTI_URL=https://dev.coti.io
GENERATE_SOURCEMAP=true
REACT_APP_ENVIRONMENT=staging
```

and run `yarn start`

### To start the web on mainnet env:

Create `.env.production` file:

```
REACT_APP_HOST=https://api.cvi.finance
REACT_APP_HOST_V2=https://api-v2.cvi.finance
REACT_APP_COTI_URL=https://coti.io
REACT_APP_CHAIN_ID=1
GENERATE_SOURCEMAP=false
REACT_APP_ENVIRONMENT=mainnet
```

and run `yarn start:production`

# Deploy Project

### Deploy to mainnet silent (only viewed internally by the company):

1. `yarn build`
2. deploy to s3 bucket. TBD

### Deploy to mainnet production (viewed by everyone):

1. `yarn build`
2. deploy to different s3 bucket. TBD

### Deploy to staging:

push your commits to `origin/staging` branch and Jenkins will automatically invoke to build your code and deploy it to staging.


### Connect to Staging ETH And Polygon Networks With Metamask:

#### Staging Ethereum:
* RPC URL https://staging-ethereum.cvi.finance
* Chain ID 31337

#### Staging Polygon:
* RPC URL http://54.92.189.167:9547
* Chain ID 31338
