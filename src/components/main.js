import React, { Component } from 'react'
import style from './main.module.scss'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { fetchFetPrice, RateLimitError, toDisplayString } from '../other/fetchFetPrice'
import { queryFetchApi } from '../other/query-api'

const TOTAL_FET_SUPPLY_DISPLAY_STRING = "1,152,997,575";
const ETHERSCAN_API_KEY = "2WQZAX9F42ZFGXPBCKHXTTGYGU2A6CD6VG";
const TOTAL_HOLDERS = "5,642";
const TOKEN_CONTRACT = "0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd";
const STAKING_CONTRACT = "0x4f3C38cD3267329f93418F4b106231022cC264c0";

/**
 * page in one component since small application.
 *
 */
export default class MainPage extends Component {

  constructor (props) {
    super(props)

      this.queryFetchApiLoop = this.queryFetchApiLoop.bind(this)
      this.fetchFetPriceLoop = this.fetchFetPriceLoop.bind(this)
    this.state = {
      highPrice: "",
      lastPrice: "",
      lowPrice: "",
      totalStaked: "",
      unreleasedAmount: ""
    }
  }

  async componentDidMount () {
    const fetPrice = await fetchFetPrice()
    const fetchAPIData =  await queryFetchApi()
     this.setState({highPrice: fetPrice.highPrice,
      lastPrice: fetPrice.lastPrice,
      lowPrice: fetPrice.lowPrice, totalStaked: fetchAPIData.totalStaked})
    this.fetchFetPriceLoop();
    this.queryFetchApiLoop();
  }

  async queryFetchApiLoop(){
      let json;
      try {
       json = await queryFetchApi()
    } catch(error) {
        return;
      }
      this.setState({totalStaked: json.totalStaked, unreleasedAmount: json.unreleasedAmount})
  }

 async fetchFetPriceLoop(){
    let json;
    try {
       json = await fetchFetPrice()
    } catch(error){
      // binance API requests you to stop if you hit 429 or IP ban.
      if(error instanceof RateLimitError) return;
    }
    this.setState({highPrice: toDisplayString(json.highPrice),
      lastPrice: toDisplayString(json.lastPrice),
      lowPrice: toDisplayString(json.lowPrice)}, setTimeout.bind(null, this.fetchFetPriceLoop, 5000))
  }

  render () {
    return (
      <div className={style.header}><img src="assets/fetch-logo.svg" alt="Fetch.ai's Logo"
                                         className={style.logo}></img>
        <h1 className={style.title}>FET Token Information</h1>
        <FontAwesomeIcon icon={faSignOutAlt} className={style.icon} rotation={180}/>

        <div className={style.wrapper}>
          <div className={style.row}>

            <div className={style.column}>
              <div className={style.columnOne}>
                <div className={classnames(style.box, style.first, style.top)}>
                  <div className={style.left}>
                    <h3 className={style.subheading}>Token Name</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>FET ERC20</span>
                    <h3 className={style.subheading}>24 Hr HIGH</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>{this.state.highPrice}</span>
                    <h3 className={style.subheading}>Total Supply</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>

                    <hr className={style.hr}></hr>
                    <span className={style.value}>{TOTAL_FET_SUPPLY_DISPLAY_STRING}</span>
                  </div>
                  <div className={style.right}>
                    <h3 className={style.subheading}>Price</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>{this.state.lastPrice}</span>
                    <h3 className={style.subheading}>24 Hr LOW</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>{this.state.lowPrice}</span>
                    <h3 className={style.subheading}>Remaining Supply</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>1,500,000,000</span>
                  </div>
                </div>

                <div className={classnames(style.box, style.second)}>
                  <div className={style.fullWidthSubheading}>
                    <h3 className={style.subheading}>Current Circulating Supply</h3>
                    <hr className={style.hr}></hr>
                  </div>
                  <div className={style.left}>
                    <h3 className={style.grey}>Total</h3>
                    <span className={style.value}>2000000000</span>
                    <h3 className={style.grey}>Locked</h3>
                    <span className={style.value}>2000000000</span>
                  </div>
                  <div className={style.right}>
                    <h3 className={style.grey}>remaining</h3>
                    <span className={style.value}>30000</span>
                    <h3 className={style.grey}>staked</h3>
                    <span className={style.value}>{this.state.totalStaked}</span>
                  </div>
                </div>

              </div>
            </div>

            <div className={style.column}>
              <div className={style.columnTwo}>


                <div className={classnames(style.box, style.third, style.top)}>
                  <div className={style.fullWidthItem}>
                    <h3 className={style.subheading}>Un-released tokens</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>{this.state.unreleasedAmount}</span>
                  </div>
                  <div className={style.singleRowLeft}>
                    <h3 className={style.subheading}>Holders</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>{TOTAL_HOLDERS}</span>
                  </div>
                  <div className={style.singleRowRight}>
                    <h3 className={style.subheading}>Of Which are AEA</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>30000</span>
                  </div>

                  <div className={style.fullWidthItem}>
                    <h3 className={style.subheading}>Token contract</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.fullWidthHr}></hr>
                    <span className={style.value}>{TOKEN_CONTRACT}</span>
                  </div>

                  <div className={style.singleRowLeft}>
                    <h3 className={style.subheading}>Total locked</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>2000000000</span>
                  </div>
                  <div className={style.singleRowRight}>
                    <h3 className={style.subheading}>Total Staked</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>{this.state.totalStaked}</span>
                  </div>

                  <div className={style.fullWidthItem}>
                    <h3 className={style.subheading}>Staking Contract</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.fullWidthHr}></hr>
                    <span className={style.value}>{STAKING_CONTRACT}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={style.column}>
              <div className={style.columnThree}>
                <div className={classnames(style.box, style.fourth, style.top)}>
                  <div className={style.singleRowLeft}>
                    <h3 className={style.subheading}>Total moved last 24 hours</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>999 9999 99</span>
                  </div>
                  <div className={style.singleRowRight}>
                    <h3 className={style.subheading}>Last TXs last 24h</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>2222222</span>
</div>
                    <div className={style.singleRowLeft}>
                    <h3 className={style.subheading}>Agents transacting last 24h</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>999 9999 99</span>
                  </div>
                  <div className={style.singleRowRight}>
                    <h3 className={style.subheading}>Agent TXs</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>2222222</span>
                  </div>
                </div>
                 <div className={style.mobileFooter}>This page and the data presented on it is for information purposes only. Whilst every effort is made to ensure it is accurate, Fetch.ai makes absolutely no guarantees as to its accuracy. Nothing on this page indicates financial advice, and the FET token is strictly a utility token. Please consult the tokenomics paper or project white paper for more information
                   </div>
              </div>
            </div>
          </div>
           <div className={style.desktopFooter}>This page and the data presented on it is for information purposes only. Whilst every effort is made to ensure it is accurate, Fetch.ai makes absolutely no guarantees as to its accuracy. Nothing on this page indicates financial advice, and the FET token is strictly a utility token. Please consult the tokenomics paper or project white paper for more information
        </div>
        </div>
      </div>

    )
  }
}

