import { chatService } from '../services/chatbot.js'

const validateMessages = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages must be an array with at least one message')
  }

  for (const message of messages) {
    if (typeof message.role !== 'string' || typeof message.content !== 'string') {
      throw new Error('Each message must have a role and content')
    }

    // must not have any other properties
    if (Object.keys(message).length !== 2) {
      throw new Error('Each message must have only a role and content')
    }

    // max string length of 1000
    if (message.content.length > 1000) {
      throw new Error('Each message content must be less than 1000 characters')
    }

    // role must be either 'user' or 'system' or 'assistant'
    if (!['user', 'system', 'assistant'].includes(message.role)) {
      throw new Error('Each message role must be either "user" or "system" or "assistant"')
    }
  }
}

// export const sendChat = async (req, res) => {
//   try {
//     const messages = req.body.messages
//     validateMessages(messages)
//     console.log('messages:', messages)

//     //   const assistantResponse = "hello from the server!"
//     const assistantResponse = await chatService.sendMessageToOpenAI(messages)

//     res.status(200).json({ success: true, answer: assistantResponse })
//   } catch (error) {
//     console.error('Error:', error.message)
//     res.status(500).json({ success: false, error: 'Internal Server Error' })
//   }
// }

export const sendChat = async (req, res) => {
  try {
    const messages = req.body.messages
    console.log('messages:', messages)
    validateMessages(messages)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // res.write('event: connected\n')
    // consume the generator from the chatService and produce a series of server-sent events
    for await (const content of chatService.sendMessageToOpenAI(messages)) {
      if (content !== undefined) {
        const json = JSON.stringify({ content, role: 'assistant' })
        res.write(`data: ${json}\n\n`)
        console.log('json:', json)
      }
    }
    res.end()
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}
