const Web3 = require('web3')
const express = require('express')
const path = require('path') // NEW
const axios = require('axios')
const BN = require('bn.js')
const RpcClient = require('tendermint').RpcClient

const parseString = require('xml2js').parseString
const app = express()
const port = process.env.PORT || 9000
const PROJECT_ID = 'cab205e574974e6d903844cb7da7537d'
const DIST_DIR = path.join(__dirname, '../dist')
const ONE_HOUR = 1000 * 60 * 60

const ETHERSCAN_API_KEY = '2WQZAX9F42ZFGXPBCKHXTTGYGU2A6CD6VG'
// const CONTRACT_ABI_STRINGIFIED = '[{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"state","type":"bool"}],"name":"setTransferAgent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"recoverTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setReleaseAgent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"burnAmount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"mintAgents","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"state","type":"bool"}],"name":"setMintAgent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"name":"setTokenInformation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradeAgent","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"releaseTokenTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradeMaster","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"fromWhom","type":"address"}],"name":"transferToOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getUpgradeState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"transferAgents","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"released","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"canUpgrade","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"tokensToBeReturned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalUpgraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"releaseAgent","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"agent","type":"address"}],"name":"setUpgradeAgent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isToken","outputs":[{"name":"weAre","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"BURN_ADDRESS","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"master","type":"address"}],"name":"setUpgradeMaster","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_initialSupply","type":"uint256"},{"name":"_decimals","type":"uint256"},{"name":"_mintable","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"OwnerReclaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newName","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"UpdatedTokenInformation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Upgrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"agent","type":"address"}],"name":"UpgradeAgentSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"state","type":"bool"}],"name":"MintingAgentChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"burner","type":"address"},{"indexed":false,"name":"burnedAmount","type":"uint256"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
const CONTRACT_ABI_STRINGIFIED = `[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"initialSupply","type":"uint256"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approveInternal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferInternal","outputs":[],"stateMutability":"nonpayable","type":"function"}]`

const STAKING_CONTRACT_ABI_STRINGIFIED = `[{"inputs":[{"internalType":"address","name":"ERC20Address","type":"address"},{"internalType":"uint256","name":"interestRatePerBlock","type":"uint256"},{"internalType":"uint256","name":"pausedSinceBlock","type":"uint256"},{"internalType":"uint64","name":"lockPeriodInBlocks","type":"uint64"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakerAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"sinceInterestRateIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"principal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"name":"BindStake","type":"event"},{"anonymous":false,"inputs":[],"name":"DeleteContract","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"targetAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ExcessTokenWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LiquidityDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"principal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"name":"LiquidityUnlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"num_of_blocks","type":"uint64"}],"name":"LockPeriod","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"NewInterestRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"sinceBlock","type":"uint256"}],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardsPoolTokenTopUp","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"targetAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardsPoolTokenWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakerAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"sinceInterestRateIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"principal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"name":"StakeCompoundInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"targetAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakerAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"liquidSinceBlock","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"principal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"name":"UnbindStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"principal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DELEGATE_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DELETE_PROTECTION_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_accruedGlobalLiquidity","outputs":[{"internalType":"uint256","name":"principal","type":"uint256"},{"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_accruedGlobalLocked","outputs":[{"internalType":"uint256","name":"principal","type":"uint256"},{"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_accruedGlobalPrincipal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_earliestDelete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_interestRates","outputs":[{"internalType":"uint256","name":"sinceBlock","type":"uint256"},{"internalType":"uint256","name":"rate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_interestRatesNextIdx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_interestRatesStartIdx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_liquidity","outputs":[{"internalType":"uint256","name":"principal","type":"uint256"},{"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_lockPeriodInBlocks","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_pausedSinceBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rewardsPoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"expirationBlock","type":"uint256"}],"name":"addInterestRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"withdrawPrincipal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"withdrawCompoundInterest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"withdrawWholeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"bindStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"unbindStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getRewardsPoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEarliestDeleteBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"for_address","type":"address"}],"name":"getNumberOfLockedAssetsForUser","outputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"for_address","type":"address"}],"name":"getLockedAssetsAggregateForUser","outputs":[{"internalType":"uint256","name":"principal","type":"uint256"},{"internalType":"uint256","name":"compoundInterest","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"for_address","type":"address"}],"name":"getLockedAssetsForUser","outputs":[{"internalType":"uint256[]","name":"principal","type":"uint256[]"},{"internalType":"uint256[]","name":"compoundInterest","type":"uint256[]"},{"internalType":"uint256[]","name":"liquidSinceBlock","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"for_address","type":"address"}],"name":"getStakeForUser","outputs":[{"internalType":"uint256","name":"principal","type":"uint256"},{"internalType":"uint256","name":"compoundInterest","type":"uint256"},{"internalType":"uint256","name":"sinceBlock","type":"uint256"},{"internalType":"uint256","name":"sinceInterestRateIndex","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"topUpRewardsPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"num_of_blocks","type":"uint64"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"updateLockPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"block_number","type":"uint256"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"pauseSince","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address payable","name":"targetAddress","type":"address"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"withdrawFromRewardsPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"targetAddress","type":"address"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"withdrawExcessTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"payoutAddress","type":"address"},{"internalType":"uint256","name":"txExpirationBlock","type":"uint256"}],"name":"deleteContract","outputs":[],"stateMutability":"nonpayable","type":"function"}]`
const CONTRACT_ADDRESS = '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85'
const STAKING_CONTRACT_ADDRESS = '0x351baC612B50e87B46e4b10A282f632D41397DE2'

const CONTRACT_OWNER_ADDRESS = "0x7cd9497b3da5de1eba948fa574c4de771124f1d9"
const TOTAL_LOCKED = '109534769'
const TOTAL_FET_SUPPLY = new BN('1152997575')
const TEN_TO_EIGHTEEN = '1' + '0'.repeat(18)
const NUMERATOR = new BN(TEN_TO_EIGHTEEN)
const FETCH_AGENTS = 'http://soef.fetch.ai:9002/'
const TOTAL_SUPPLY_METTALEX = new BN("40000000")


const LCD_URL = "http://rest-agent-land.fetch.ai"
const RPC_URL = "https://rpc-agent-land.fetch.ai/"
const WS_END_POINT = "ws://rpc-agent-land.fetch.ai/websocket"

const NETWORK_NAME_OF_LCD_URL = "agent-land"

const METTALEX_FOUNDATION_ADDRESS =  "0x2f2bd2745b24d73707817d1d5de1de7504241ac9";
const METTALEX_STAKING_ADDRESS = "0x7354f36fd74a656b4db8429c3fd937b99cd69e45";
const METTALEX_CONTRACT_ABI_STRINGIFIED = `[{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint256","name":"_cap","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]`
const METTALEX_CONTRACT_ADDRESS = "0x2e1e15c44ffe4df6a0cb7371cd00d5028e571d14"

const { Pool } = require('pg')
const pool = new Pool()
let unreleasedAmount = ''
let twentyFourHoursAgoEthereumBlockNumber
let fetTransferedInLastTwentyFourHours = ''
let largeTransferCountInLastTwentyFourHours = ''
let currentCirculatingSupply = ''

let totalAgentsEver = ''
let totalAgentsOnlineRightNow = ''
let peakAgentsOnlineNow = ''
let totalSearchQueriesForAgentsToFindOtherAgents = ''
let totalAgentsFound = ''

let activeValidators = ''
let inactiveValidators = ''
let averageBlockTime = ''

let lockedPeriodBlocks = ""
let totalUnstaked = ""
let totalLocked = ""
let totalStaked = ""

let circulatingSupplyMettalex = ''

// let client = RpcClient(WS_END_POINT)


// request a block
// client.block({ height: 100 }).then((res) => console.log("WEBSOCKET" , res))
//
// client.subscribe(["tm.event='Tx'"], (data) => {
// console.log("new tx ", data)
//         })
//
// client.subscribe(["tm.event='NewBlock'"], (data) => {
// console.log("new block ", data)
//
//         })



function getBiggestSavedBlockNumber(callback){

    pool.query(
    `SELECT MAX(blocknumber) AS maxBlocknumber FROM fettxs;`,
    (err, res) => {
      if (
        typeof res === 'undefined'
      ) {
        return
      }

      console.log(blocknumber)
      callback(res)
    }
  )

}



String.prototype.insertCommas = function () {
  return this.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

function getEthereumBlockNumberFrom24HoursAgo () {
  const twentyFourHoursAgoUnixTimestamp =
    Math.floor(Date.now() / 1000) - 24 * 3600
  axios
    .get(
      `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${twentyFourHoursAgoUnixTimestamp}&closest=before&apikey=${ETHERSCAN_API_KEY}`
    )
    .then(resp => {
      if (resp.status !== 200 || typeof resp.data === 'undefined') return
      twentyFourHoursAgoEthereumBlockNumber = parseInt(resp.data.result)
    })
    .catch(err => {
      console.log('Ethereum block number request rejected with status : ', err)
    })
}

getEthereumBlockNumberFrom24HoursAgo()
setInterval(getEthereumBlockNumberFrom24HoursAgo, 15000)

function getSummedFETTransactions () {
  if (typeof twentyFourHoursAgoEthereumBlockNumber === 'undefined') return

  pool.query(
    `SELECT SUM(fetvalue) as TOTAL from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber}`,
    (err, res) => {
      if (
        typeof res === 'undefined' ||
        typeof res.rows[0] === 'undefined' ||
        typeof res.rows[0].total === 'undefined'
      ) {
        return
      }

      if (res.rows[0].total === null) {
        fetTransferedInLastTwentyFourHours = '0'
      } else {
        fetTransferedInLastTwentyFourHours = res.rows[0].total
      }
    }
  )
}

setInterval(getSummedFETTransactions, 5000)

function countLargeTransactions () {
  if (typeof twentyFourHoursAgoEthereumBlockNumber === 'undefined') return

  pool.query(
    `SELECT COUNT(fetvalue) from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber} AND fetvalue > 250000`,
    (err, res) => {
      if (
        typeof res === 'undefined' ||
        typeof res.rows[0] === 'undefined' ||
        typeof res.rows[0].count === 'undefined'
      ) {
        return
      }
      largeTransferCountInLastTwentyFourHours = res.rows[0].count
    }
  )
}

setInterval(countLargeTransactions, 5000)

function FETRemainingInContract () {
  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + PROJECT_ID))
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI_STRINGIFIED), CONTRACT_ADDRESS)
  contract.methods.balanceOf(CONTRACT_OWNER_ADDRESS).call((error, balance) => {
    contract.methods.decimals().call((error, decimals) => {
      if (error) return
          unreleasedAmount = new BN(balance.toString()).div(NUMERATOR).toString()
    })
  })
}

FETRemainingInContract()
setInterval(FETRemainingInContract, ONE_HOUR)


function getActiveValidators() {
    axios
    .get(`${LCD_URL}/staking/validators`)
    .then(resp => {
      console.log("respance", resp.data.result)
      console.log("respance", resp.data.result)

      activeValidators = resp.data.result.filter((validator) => {
        return validator.status === 2
      }).length
      inactiveValidators = resp.data.result.filter((validator) => {
        return validator.status !== 2
      }).length
    })
}

getActiveValidators()

function getTotals() {

     function getAccruedGlobalPrincipal(contract) {
    return  contract.methods._accruedGlobalPrincipal().call()
  }

   function getAccruedGlobalLiquidity(contract) {
    return  contract.methods._accruedGlobalLiquidity().call()
  }

   function getLocked(contract) {
    return contract.methods._accruedGlobalLocked().call()
  }
   function getLockPeriod(contract) {
    return contract.methods._lockPeriodInBlocks().call()
  }

  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/52a657432c274299a973790b857c5d2c'))
  const contract = new web3.eth.Contract(JSON.parse(STAKING_CONTRACT_ABI_STRINGIFIED), STAKING_CONTRACT_ADDRESS)

  const promise1 = getAccruedGlobalPrincipal(contract)
  const promise2 = getAccruedGlobalLiquidity(contract)
  const promise3 = getLocked(contract)
  const promise4 = getLockPeriod(contract)

  Promise.all([promise1, promise2, promise3, promise4]).then((arrayOfPromises) => {
    totalLocked = arrayOfPromises[1].principal;
    totalStaked = new BN(arrayOfPromises[0]).sub(new BN(arrayOfPromises[1].principal)).sub(new BN(arrayOfPromises[2].principal))
    totalUnstaked = arrayOfPromises[2].principal
    lockedPeriodBlocks =  arrayOfPromises[3]
  }).catch(err => {
      console.log('FAILURE contract balanceof api request rejected with status : ', err)
    })
}

getTotals()

function calculateAverageBlockTime() {
  let currentBlockTime;
  let pastBlockTime;
  const blocksOverWhichToAverage = 100

   getCurrentBlockData(getPastBlockData)

  function getPastBlockData(height) {

      const pastHeight = height - blocksOverWhichToAverage

      if(pastHeight <= 0) {
        console.log("this program cannot calc average block time until at least a 100 block 100")
      }

      axios
      .get(`${RPC_URL}/block?height=${pastHeight}`)
      .then(resp => {
            console.log("currentBlockTimeTime", resp.data.result.block.header.time)
            pastBlockTime = resp.data.result.block.header.time
            calcAverage()
      })
  }

  function calcAverage(){
     const past = new Date(pastBlockTime).getTime()
     const current = new Date(currentBlockTime).getTime()
     const diff = current - past;
     const diffSeconds = diff/1000

    averageBlockTime = diffSeconds/blocksOverWhichToAverage
  }

  function getCurrentBlockData(callback) {
    // lets get current block first
    axios
      .get(`${RPC_URL}/block`)
      .then(resp => {
        console.log("currentBlockTimeResult", resp.data.result.block.header.height)
        console.log("currentBlockTimeTime", resp.data.result.block.header.time)

        const height = resp.data.result.block.header.height

        currentBlockTime = resp.data.result.block.header.time

        callback(height)
      }).catch((error) => {
      console.log("error getting current block is  ", error)
    })
  }


}
calculateAverageBlockTime()


function MettalexCirculatingSupply () {

  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + PROJECT_ID))
  const contract = new web3.eth.Contract(JSON.parse(METTALEX_CONTRACT_ABI_STRINGIFIED), METTALEX_CONTRACT_ADDRESS)

  const promise1 = balance(contract, METTALEX_STAKING_ADDRESS)
  const promise2 = balance(contract, METTALEX_FOUNDATION_ADDRESS)

  Promise.all([promise1, promise2]).then((arrayOfPromises) => {
   const toDeduct =  arrayOfPromises[0].add(arrayOfPromises[1])
     circulatingSupplyMettalex = TOTAL_SUPPLY_METTALEX.sub(toDeduct).toString()
  }).catch(err => {
      console.log('Mettalex contract balanceof api request rejected with status : ', err)
    })

  function balance(contract, address){
    return new Promise(function(resolve, reject) {
      let res
      contract.methods.balanceOf(address).call((error, balance) => {
        contract.methods.decimals().call((error, decimals) => {
          if (error) return reject()
          res = new BN(balance.toString()).div(NUMERATOR)
          resolve(res)
        })
      })
    })
  }
}

// MettalexCirculatingSupply()
// setInterval(MettalexCirculatingSupply, ONE_HOUR)

// /**
//  * gets staking data and saves it to text file as json string.
//  */
// function totalStaked () {
//   axios
//     .get(STAKING_API)
//     .then(resp => {
//       if (resp.status !== 200) return
//       staked = calculateTotalStaked(
//         resp.data.payload.phase,
//         resp.data.payload.finalisationPrice,
//         resp.data.payload.slotsSold
//       )
//     })
//     .catch(err => {
//       console.log('staking api request rejected with status : ', err)
//     })
// }
//
// // calc the total amount staked
// totalStaked()
// setInterval(totalStaked, 15000)

function calcCurrentCirculatingSupply () {
  if (totalStaked === '' || unreleasedAmount === '') return
  // Total - locked - staked - remaining == current circulating supply.
  // Un-released tokens are understood to be the "remaining" part of this calculation
  debugger;
  currentCirculatingSupply = TOTAL_FET_SUPPLY.sub(new BN(totalStaked)).sub(new BN(TOTAL_LOCKED)).sub(new BN(unreleasedAmount)).abs().toString()
}

calcCurrentCirculatingSupply()
setInterval(calcCurrentCirculatingSupply, 5000)

function AgentInformation () {
  axios
    .get(FETCH_AGENTS)
    .then(resp => {
      if (resp.status !== 200) return
      // parse the xml
      parseString(resp.data, function (err, result) {
        const response = result.response
        totalAgentsEver = response.statistics[0].total_agents_ever[0]
        totalAgentsOnlineRightNow = new BN(response.statistics[0].total_agents_ever[0]).sub(new BN(response.statistics[0].expired_agents[0])).toString()
        peakAgentsOnlineNow = response.statistics[0].peaks[0].peak[0]._
        totalSearchQueriesForAgentsToFindOtherAgents = response.statistics[0].total_search_queries[0]
        totalAgentsFound = response.statistics[0].total_agents_found[0]
      })

    })
}

AgentInformation()
setInterval(AgentInformation, 15000)

app.use(express.static(DIST_DIR))

app.get('/token_information_api', (req, res) => {
  res.send({
    totalStaked: totalStaked,
    unreleasedAmount: unreleasedAmount,
    recentlyTransfered: fetTransferedInLastTwentyFourHours,
    recentLargeTransfers: largeTransferCountInLastTwentyFourHours,
    currentCirculatingSupply: currentCirculatingSupply,
    totalAgentsEver: totalAgentsEver,
    totalAgentsOnlineRightNow: totalAgentsOnlineRightNow,
    peakAgentsOnlineNow: peakAgentsOnlineNow,
    totalSearchQueriesForAgentsToFindOtherAgents: totalSearchQueriesForAgentsToFindOtherAgents,
    totalAgentsFound: totalAgentsFound,
  })
})


app.get('/staking', (req, res) => {
  res.send({
    lockedPeriodBlocks: lockedPeriodBlocks,
    totalUnstaked: totalUnstaked,
    totalLocked: totalLocked,
    totalStaked: totalStaked,
  })
})

app.get('/staking', (req, res) => {
  res.send({
    lockedPeriodBlocks: lockedPeriodBlocks,
    totalUnstaked: totalUnstaked,
    totalLocked: totalLocked,
    totalStaked: totalStaked,
  })
})


app.get(`/status/${NETWORK_NAME_OF_LCD_URL}`, (req, res) => {
  res.send({
     activeValidators: activeValidators,
    inactiveValidators: inactiveValidators,
    averageBlockTime: averageBlockTime
  })
})




app.get('/mettalex_circulating_supply', (req, res) => {
  res.send(circulatingSupplyMettalex)
})


app.listen(port, function () {
  console.log('App listening on port: ' + port)
})
