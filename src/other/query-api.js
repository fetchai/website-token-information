const TOKEN_INFORMATION_API = "./token_information_api"

export const queryFetchApi = async () => {
  let error = false;
  const response = await fetch(TOKEN_INFORMATION_API).catch(() => error = true)
    if (error) throw new Error()
    if(response.status !== 200)  throw new Error()
    const json = await response.json().catch(() => error = true)
    return {
      totalStaked: json.totalStaked, unreleasedAmount: json.unreleasedAmount,
      recentLargeTransfers: json.recentLargeTransfers,
      recentlyTransfered: json.recentlyTransfered,
      currentCirculatingSupply: json.currentCirculatingSupply,
      totalAgentsFound: json.totalAgentsFound,
      totalAgentsOnlineRightNow: json.totalAgentsOnlineRightNow,
      totalSearchQueriesForAgentsToFindOtherAgents: json.totalSearchQueriesForAgentsToFindOtherAgents,
    }
}