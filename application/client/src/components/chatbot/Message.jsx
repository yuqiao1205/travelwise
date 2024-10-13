import React from 'react'
import './message.css'
import PropTypes from 'prop-types'

function Message ({ message }) {
  return (
    <div className="message">
      {message.role && (
        <p className={`label ${message.role}`}>
          {message.role === 'assistant' ? 'Assistant:' : 'User:'}
        </p>
      )}
      <p className="content">{message.content}</p>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.object.isRequired
}
export default Message
