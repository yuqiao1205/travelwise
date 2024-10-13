import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const openai = new OpenAI(OPENAI_API_KEY)

const systemMessage = {
  role: 'system',
  content: 'You are a helpful travel assistant chatting with a user. Please keep your responses under 100 characters.'
}

// export async function sendMessageToOpenAI (messages) {
//   // insert the system message at the beginning of the messages array
//   messages.unshift(systemMessage)
//   console.log('messages:', messages)
//   const completion = await openai.chat.completions.create({
//     messages,
//     model: 'gpt-3.5-turbo'
//   })

//   return completion.choices[0].message.content
// }

export async function * sendMessageToOpenAI (messages) {
  // insert the system message at the beginning of the messages array
  messages.unshift(systemMessage)
  console.log('messages:', messages)
  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
    stream: true
  })

  // openai produce the chunks and we yield them to the controller (a generator function)
  for await (const chunk of completion) {
    // console.log('chunk:', chunk.choices[0].delta)
    yield chunk.choices[0].delta.content
  }
}

export const chatService = {
  sendMessageToOpenAI
}
