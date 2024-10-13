import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import './searchInputFilter.css'

const SearchInputFilter = () => {
  const [searchFilter, setSearchFilter] = useState('')
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText)}&filter=${searchFilter}`)
      setSearchText('') // Optionally clear the search input after navigating
    }
  }

  const handleKeyPress = (e) => {
    console.log('key pressed', e.key)
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    // <div className='search-input-container'>
    <div className=''>

      <div className='container1'>
        <form className='w-100'>
          {/* Dropdown menu for filter selection */}
          <select className='border'
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          >
            <option value='default' disabled>Filter</option>
            <option value=''>All</option>
            <option value='cat'>by Region</option>
            <option value='title'>by Title</option>
            <option value='username'>by Author</option>
            {/* Add more options as needed */}
          </select>
          {/* Input text for search text */}
          <input
            className='border'
            type='text'
            placeholder='Enter search text...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {/* Search icon */}
          <SearchOutlinedIcon onClick={handleSearch} style={{ cursor: 'pointer', color: 'pink' }} />
        </form>
      </div>
    </div>
  // </div>
  )
}

export default SearchInputFilter
