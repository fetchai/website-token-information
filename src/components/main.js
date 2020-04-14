import React, { Component } from 'react'
import style from './main.module.scss'

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * component corresponds to download view.
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
        <FontAwesomeIcon icon={faSignOutAlt} className={style.icon}/>

      <div className={style.wrapper}>
      <div className={style.row}>


      <div className={style.column}>
      <div className ={style.columnOne}>
      <div className ={style.box}>
        <div className ={style.left}>
          <h3 className ={style.subheading}>Token Name</h3>
          <hr></hr>
          <span className ={style.value}>FET ERC20</span>
          <h3 className ={style.subheading}>24 Hr HIGH</h3>
          <hr></hr>
          <span className ={style.value}>.019c</span>
          <h3 className ={style.subheading}>Total Supply</h3>
          <hr></hr>
          <span className ={style.value}>1,500,000,000</span>
        </div>
        <div className ={style.right}>
 <h3 className ={style.subheading}>Price</h3>
          <hr></hr>
          <span className ={style.value}>.018c</span>
          <h3 className ={style.subheading}>24 Hr LOW</h3>
          <hr></hr>
          <span className ={style.value}>.017c</span>
          <h3 className ={style.subheading}>Remaining Supply</h3>
          <hr></hr>
          <span className ={style.value}>1,500,000,000</span>
        </div>
      </div>
    </div>
  </div>


  <div className={style.column}>
  <div className ={style.columnTwo}>
  Some Text in Column Two
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

