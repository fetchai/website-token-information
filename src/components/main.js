import React, { Component } from 'react'
import style from './main.module.scss'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'

/**
 * page in one component since small application.
 *
 */
export default class MainPage extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className={style.header}><img src="assets/fetch-logo.svg" alt="Fetch.ai's Logo"
                                         className={style.logo}></img>
        <h1 className={style.title}>FET Token Information</h1>
        <FontAwesomeIcon icon={faSignOutAlt} className={style.icon} rotation={180}/>

        {/*<div className={style.wrapper}>*/}
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
                    <span className={style.value}>.019c</span>
                    <h3 className={style.subheading}>Total Supply</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>

                    <hr className={style.hr}></hr>
                    <span className={style.value}>1,500,000,000</span>
                  </div>
                  <div className={style.right}>
                    <h3 className={style.subheading}>Price</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>.018c</span>
                    <h3 className={style.subheading}>24 Hr LOW</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>.017c</span>
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
                    <span className={style.value}>3000</span>
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
                    <span className={style.value}>15,000,000,00</span>
                  </div>
                  <div className={style.singleRowLeft}>
                    <h3 className={style.subheading}>Holders</h3>
                    <hr className={style.hr}></hr>
                    <span className={style.value}>2000000000</span>
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
                    <span className={style.value}>0x687fyt........ghjghjg9789789798</span>
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
                    <span className={style.value}>30000</span>
                  </div>

                  <div className={style.fullWidthItem}>
                    <h3 className={style.subheading}>Staking Contract</h3>
                    <img src="assets/info-icon.svg" alt="info icon"
                         className={style.info}></img>
                    <hr className={style.fullWidthHr}></hr>
                    <span className={style.value}>0x687fyt........ghjghjg9789789798</span>
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
              </div>
            </div>


          </div>
        {/*</div>*/}

        <div className={style.footer}>This page and the data presented on it is for information purposes only. Whilst every effort is made to ensure it is accurate, Fetch.ai makes absolutely no guarantees as to its accuracy. Nothing on this page indicates financial advice, and the FET token is strictly a utility token. Please consult the tokenomics paper or project white paper for more information</div>


      </div>

    )
  }
}

