import React, { useState } from 'react'
import Conversation from './Conversation'
import { SSE } from 'sse.js'
import './chat.css'
import { useLocation } from 'react-router-dom'

function Chat () {
  const location = useLocation()
  console.log(location.pathname) // result: '/secondpage'

  // Extract base URL using window.location
  const baseURL = window.location.origin
  console.log(baseURL)

  const [messages, setMessages] = useState([
    { content: 'Hello! How can I help you today?', role: 'assistant' }
  ])

  const handleSendMessage = async (newMessage) => {
    // Add the new message to the messages state
    // setMessages([...messages,
    //   { content: newMessage, role: 'user' },
    //   { content: '...', role: 'assistant' }])

    return new Promise((resolve, reject) => {
      try {
        messages.push({ content: newMessage, role: 'user' })
        messages.push({ content: '...', role: 'assistant' })
        console.log(messages)
        const payload = {
          messages
        }

        // JSON payload of messages
        const source = new SSE(baseURL + '/chat',
          {
            headers: { 'Content-Type': 'application/json' },
            payload: JSON.stringify(payload),
            method: 'POST',
            start: false,
            debug: true
          })

        source.addEventListener('message', (event) => {
          // extract json from event.data
          const botUpdate = JSON.parse(event.data)
          // append the new datetime to the existing datetimes array

          // message is the same as before, but the content of the last message
          // is updated to concatenate botUpdate.content
          // consume stream of SSE events and update the messages state
          const message = messages[messages.length - 1]
          message.content += botUpdate.content
          setMessages([...messages])
          console.log('message:', botUpdate.content)
        })

        source.addEventListener('error', (event) => {
          console.log('SSE error:', event)
          source.close() // Ensure to close the connection if not done automatically
          reject(new Error('SSE connection error'))
        })

        source.addEventListener('close', () => {
          console.log('SSE connection closed')
          resolve()
        })

        source.stream()
      } catch (error) {
        reject(error)
      }
    }).then(() => {
    // This part will execute after the promise is resolved, i.e., after the connection closes
      console.log('All messages have been received')
    }).catch((error) => {
      console.error('An error occurred:', error)
    })
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(e.target.value)
      e.target.value = '' // Clear the input field
    }
  }

  return (
    <>
      {/* <RightBar/> */}
      <div className="chat-container">

        <div className="sender-name">
          <Conversation messages={messages} />
        </div>
        <div className="input-container">
          <input className='chat-input'
            type="text"
            placeholder="Type your message..."
            onKeyDown={handleInputKeyDown}
          />
        </div>
      </div>
    </>
  )
}

export default Chat
