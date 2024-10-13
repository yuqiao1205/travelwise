import './header2.css'
// import SearchInput from '../../components/search/SearchInput'
import headerpic2 from '../../img/header3.jpg'
import React from 'react'

export default function Header () {
  return (
    <div className='header2'>
      <div className='header2Titles'>
        {/* <span className='header2TitleLg'>TravelWise</span> */}
      </div>
      <img
        className='header2Img'
        src={headerpic2}
        alt='nightbeach'
      />
      <div className='header2-searchbar'>
        {/* <SearchInput /> */}
      </div>
    </div>
  )
}
