import { React, useState } from 'react'
import { useLocation } from 'react-router-dom'
// import Header2 from '../../components/header2/Header2'
import Posts from '../../components/posts/Posts'
import Rightbar from '../../components/rightbar/Rightbar'
import Header2 from '../../components/header2/Header2'
import CarouselPage from '../../components/carousels/Carousels'
// import SearchInput from '../../components/search/SearchInput'
import './home.css'
import SubscribeForm from '../../components/subscribe/SubscribeForm'
import ScrollToTop from '../../components/scrollToTop/ScrollToTop'

const Home = () => {
  // const location = useLocation()
  const [triggerScroll, setTriggerScroll] = useState(false)
  const location = useLocation() // Use the useLocation hook to get the current location object

  // Parse the query string
  const queryParams = new URLSearchParams(location.search)
  const hasCatParam = queryParams.has('cat') // Check if 'cat' parameter exists

  // Determine if the Rightbar should be shown
  const showRightbar = !hasCatParam
  const showHome = !hasCatParam

  const handleScrollToTop = () => {
    setTriggerScroll(!triggerScroll) // Toggles the trigger to scroll to top
  }

  return (
    <>
      <div>
        {showHome ? <CarouselPage /> : <Header2 />}
        <div className="home">

          <div className="homePosts">
            <Posts />
            <button onClick={handleScrollToTop}>Scroll To Top</button>
            <ScrollToTop trigger={triggerScroll} elementId="topElement" />
          </div>
          {showRightbar && (
            <div className="homeRightbar">
              <Rightbar />
            </div>
          )}
        </div>
        <SubscribeForm />
      </div>
    </>
  )
}

export default Home
