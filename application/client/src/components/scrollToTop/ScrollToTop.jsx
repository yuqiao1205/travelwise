import { useEffect } from 'react'
import PropTypes from 'prop-types'

const ScrollToTop = ({ trigger, elementId }) => {
  useEffect(() => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [trigger, elementId])

  return null
}

ScrollToTop.propTypes = {
  trigger: PropTypes.any.isRequired,
  elementId: PropTypes.string.isRequired
}

export default ScrollToTop
