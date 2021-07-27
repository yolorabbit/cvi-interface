import { getGraphEndpoint } from "contracts/utils";
import { request, gql } from "graphql-request";
const POLYGON_USDC_GRAPH_ENDPOINT = "https://api.thegraph.com/subgraphs/name/vladi-coti/cvi-polygon-usdc";

const allPlatformEventsQuery = gql`
  {
    openPositions(orderBy: timestamp, orderDirection: desc) {
      id
      platform
      timestamp
      account
      tokenAmount
      feeAmount
      positionUnitsAmount
    }
    closePositions(orderBy: timestamp, orderDirection: desc) {
      id
      platform
      timestamp
      account
      tokenAmount
      feeAmount
      positionUnitsAmount
    }
  }
  {
    deposits(orderBy: timestamp, orderDirection: desc) {
      platform
      timestamp
      account
      tokenAmount
      feeAmount
      lpTokensAmount
    }
    withdraws(orderBy: timestamp, orderDirection: desc) {
      platform
      timestamp
      account
      tokenAmount
      feeAmount
      lpTokensAmount
    }
  }
`;

// const allPositionsQuery = gql`
//   {
//     openPositions(orderBy: timestamp, orderDirection: desc) {
//       id
//       platform
//       timestamp
//       account
//       tokenAmount
//       feeAmount
//       positionUnitsAmount
//     }
//     closePositions(orderBy: timestamp, orderDirection: desc) {
//       id
//       platform
//       timestamp
//       account
//       tokenAmount
//       feeAmount
//       positionUnitsAmount
//     }
//   }
// `;

// const allLiquidityQuery = gql`
//   {
//     deposits(orderBy: timestamp, orderDirection: desc) {
//       platform
//       timestamp
//       account
//       tokenAmount
//       feeAmount
//       lpTokensAmount
//     }
//     withdraws(orderBy: timestamp, orderDirection: desc) {
//       platform
//       timestamp
//       account
//       tokenAmount
//       feeAmount
//       lpTokensAmount
//     }
//   }
// `;

const accountPositionsQuery = gql`
  query getPositions($account: String!, $platformAddress: String!, $fromTimestamp: BigInt! = 0) {
    openPositions(
      where: { account: $account, platformAddress: $platformAddress, timestamp_gt: $fromTimestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      platform
      cviValue
      blockNumber
      timestamp
      account
      tokenAmount
      feeAmount
      positionUnitsAmount
    }
    closePositions(
      where: { account: $account, platformAddress: $platformAddress, timestamp_gt: $fromTimestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      platform
      cviValue
      blockNumber
      timestamp
      account
      tokenAmount
      feeAmount
      positionUnitsAmount
    }
  }
`;

const accountLiquidityQuery = gql`
  query getLiquidity($account: String!, $platformAddress: String!, $fromTimestamp: BigInt! = 0) {
    deposits(
      where: { account: $account, platformAddress: $platformAddress, timestamp_gt: $fromTimestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      platform
      timestamp
      account
      blockNumber
      tokenAmount
      feeAmount
      lpTokensAmount
    }
    withdraws(
      where: { account: $account, platformAddress: $platformAddress, timestamp_gt: $fromTimestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      platform
      timestamp
      account
      blockNumber
      tokenAmount
      feeAmount
      lpTokensAmount
    }
  }
`;

const collectedFeesQuery = gql`
    {
      collectedFees(first: 1000, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        token
        tokenAddress
        account
        tokenAmount
      }
    }
`;

const lastOpenQuery = gql`
  query getPositions($account: String!, $platformAddress: String!) {
    openPositions(where: { account: $account, platformAddress: $platformAddress }, first: 1, orderBy: timestamp, orderDirection: desc) {
      id
      platform
      blockNumber
      cviValue
      timestamp
      account
      tokenAmount
      feeAmount
      positionUnitsAmount
    }
  }
`;

export async function collectedFees() {
  return await request(await getGraphEndpoint(), collectedFeesQuery );
}

export async function collectedFeesUSDC() {
  return await request(POLYGON_USDC_GRAPH_ENDPOINT, collectedFeesQuery );
}

export async function account_liquidities(account, platformAddress, fromTimestamp) {
  return await request(await getGraphEndpoint(), accountLiquidityQuery, { account, platformAddress, fromTimestamp });
}

export async function account_liquiditiesUSDC(account, platformAddress, fromTimestamp) {
  return await request(POLYGON_USDC_GRAPH_ENDPOINT, accountLiquidityQuery, { account, platformAddress, fromTimestamp });
}

export async function account_positions(account, platformAddress, fromTimestamp) {
  return await request(await getGraphEndpoint(), accountPositionsQuery, { account, platformAddress, fromTimestamp });
}

export async function account_positionsUSDC(account, platformAddress, fromTimestamp) {
  return await request(POLYGON_USDC_GRAPH_ENDPOINT, accountPositionsQuery, { account, platformAddress, fromTimestamp });
}

export async function lastOpen(account, platformAddress) {
  return await request(await getGraphEndpoint(), lastOpenQuery, { account, platformAddress });
}

export async function lastOpenUSDC(account, platformAddress) {
  return await request(POLYGON_USDC_GRAPH_ENDPOINT, lastOpenQuery, { account, platformAddress });
}

export async function allPlatformEvents() {
  return await request(await getGraphEndpoint(), allPlatformEventsQuery);
}