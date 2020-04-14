import React, { Component } from 'react'
import style from './main.module.scss'

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from "classnames";

/**
 * page in one component since small application.
 *
 */
export default class MainPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      address: '',
    }
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
      <div className ={style.columnOne}>
      <div className ={classnames(style.box, style.first)}>
        <div className ={style.left}>
          <h3 className ={style.subheading}>Token Name</h3>
          <hr className ={style.hr}></hr>
          <span className ={style.value}>FET ERC20</span>
          <h3 className ={style.subheading}>24 Hr HIGH</h3>
           <img src="assets/info-icon.svg" alt="info icon"
                                         className={style.info}></img>
          <hr className ={style.hr}></hr>
          <span className ={style.value}>.019c</span>
          <h3 className ={style.subheading}>Total Supply</h3>
                  <img src="assets/info-icon.svg" alt="info icon"
                                         className={style.info}></img>

          <hr className ={style.hr}></hr>
          <span className ={style.value}>1,500,000,000</span>
        </div>
        <div className ={style.right}>
 <h3 className ={style.subheading}>Price</h3>
          <hr className ={style.hr}></hr>
          <span className ={style.value}>.018c</span>
          <h3 className ={style.subheading}>24 Hr LOW</h3>
                  <img src="assets/info-icon.svg" alt="info icon"
                                         className={style.info}></img>
          <hr className ={style.hr}></hr>
          <span className ={style.value}>.017c</span>
          <h3 className ={style.subheading}>Remaining Supply</h3>
                  <img src="assets/info-icon.svg" alt="info icon"
                                         className={style.info}></img>
          <hr className ={style.hr}></hr>
          <span className ={style.value}>1,500,000,000</span>
        </div>
      </div>

        <div className ={classnames(style.box, style.second)}>
           <div className ={style.fullWidthSubheading}>
           <h3 className ={style.subheading}>Current Circulating Supply</h3>
               <hr className ={style.hr}></hr>
        </div>
        <div className ={style.left}>
          <h3 className ={style.grey}>Total</h3>
          <span className ={style.value}>2000000000</span>
          <h3 className ={style.grey}>Locked</h3>
          <span className ={style.value}>2000000000</span>
        </div>
        <div className ={style.right}>
 <h3 className ={style.grey}>remaining</h3>
          <span className ={style.value}>30000</span>
          <h3 className ={style.grey}>staked</h3>
          <span className ={style.value}>3000</span>
  </div>

        </div>

    </div>
  </div>


  <div className={style.column}>
  <div className ={style.columnTwo}>


 <div className ={classnames(style.box, style.third)}>
           <div className ={style.fullWidthItem}>
           <h3 className ={style.subheading}>un-released tokens</h3>
               <hr></hr>
        </div>
        <div className ={style.left}>
          <h3 className ={style.subheading}>Holders</h3>
          <span className ={style.value}>2000000000</span>
        </div>
        <div className ={style.right}>
 <h3 className ={style.subheading}>Of Which are AEA</h3>
          <span className ={style.value}>30000</span>
          <h3 className ={style.subheading}>staked</h3>
          <span className ={style.value}>3000</span>
      </div>
   <div className ={style.fullWidthItem}>
           <h3 className ={style.subheading}>token contract</h3>
               <hr></hr>
      <span className ={style.value}>0x687fyt........ghjghjg9789789798</span>
        </div>
     <div className ={style.left}>
          <h3 className ={style.subheading}>Total locked</h3>  <img src="assets/info-icon.svg" alt="info icon"
                                         className={style.info}></img>
          <span className ={style.value}>2000000000</span>
        </div>
        <div className ={style.right}>
 <h3 className ={style.subheading}>Of Which are AEA</h3>  <img src="assets/info-icon.svg" alt="info icon"
                                         className={style.info}></img>
          <span className ={style.value}>30000</span>
          </div>
   <div className ={style.fullWidthItem}>
           <h3 className ={style.subheading}>Staking Contract</h3>
               <hr></hr>

        </div>



      </div>
  </div>
  </div>

  <div className={style.column}>
  <div className ={style.columnThree}>
  Some Text in Column Two
  </div>
  </div>



  </div>
  </div>
  </div>

  )
  }
  }

