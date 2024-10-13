import { Link } from 'react-router-dom'
import './rightbar.css'
import Blogimg from '../../img/blogimg.jpg'
// import QuestionForm from '../../pages/questionForm/QuestionForm'
// import SubscribeForm from '../../components/subscribe/SubscribeForm'
import React from 'react'

export default function Rightbar () {
  return (
    <div className='rightbar'>
      <div className='rightbarItem'>
        <span className='rightbarTitle'>What Is TravelWise</span>
        <img
          src={Blogimg}
          alt=''
        />
        <p className='travelwise'>
        TravelWise aim to give you the best and most up-to-date information on the major
        travel destinations around the world.Here you will find things to see and do, information
        about costs, recommendations on places to stay, suggested restaurants, transportation tips, and safety advice.
        </p>

      </div>
      {/* <div className='rightbarItem'>
      <span className='rightbarTitle'>Asking Question</span>
      <QuestionForm></QuestionForm>
      </div> */}
      <div className='rightbarItem'>
        <span className='rightbarTitle'>Travel Info Tools</span>
        <ul className='rightbarList'>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='/weather_info'>
              Weather-Info
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='/information'>
              Country-Info
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='/yelpsearch'>
              Yelp-Search
            </Link>
          </li>
        </ul>
      
      </div>

      <div className='rightbarItem'>
        <span className='rightbarTitle'>Where Do You Want to Go?</span>
        <ul className='rightbarList'>
          <li className='rightbarListItem'>
            <Link className='link' to='/?cat=Asia'>
              Asia
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link' to='/?cat=Europe'>
              Europe
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link' to='/?cat=America'>
              America
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link' to='/?cat=Africa'>
              Africa
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link' to='/?cat=Middleeast'>
              Middle East
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link' to='/?cat=Caribbean'>
              Caribbean
            </Link>
          </li>
        </ul>
      </div>

      <div className='rightbarItem'>
        <span className='rightbarTitle'>Booking All In One</span>
        <ul className='rightbarList'>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='https://skyscanner.com/'>
              Flights
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='https://www.booking.com/'>
              Hotels
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='https://www.discovercars.com/'>
              Cars
            </Link>
          </li>
          <li className='rightbarListItem'>
            <Link className='link-tools' to='https://www.airbnb.com/'>
              Homestay
            </Link>
          </li>
        </ul>
      
      </div>
    </div>

  )
}
