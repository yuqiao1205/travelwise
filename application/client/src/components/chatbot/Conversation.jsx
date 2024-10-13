import React, { useEffect, useRef } from 'react'
import './conversation.css' // Import the conversation.css file
import PropTypes from 'prop-types'

function Conversation ({ messages }) {
  // Create a ref for the latest message
  const endOfMessagesRef = useRef(null)

  // Scroll into view whenever messages update
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='chatbot-body'>
      {messages.map((message, index) => {
        // Determine if the message was received or sent
        const isReceivedMessage = message.role === 'assistant'

        return (
          <div key={index} className={isReceivedMessage ? 'message-received' : 'message-sent'}>
            <div>
              <p className='conversation-message'>
                {isReceivedMessage ? 'Assistant:' : 'You:'} {message.content}
              </p>
            </div>
          </div>
        )
      })}
      {/* Add a ref to the last element */}
      <div ref={endOfMessagesRef} />
    </div>
  )
}

Conversation.propTypes = {
  messages: PropTypes.array.isRequired
}

export default Conversation
