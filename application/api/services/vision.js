import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const debug = false
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openaiEndpoint = 'https://api.openai.com/v1/chat/completions'
const visionPrompt = 'This is a place I\'d like to go, please give a shortlist of 3 places this is likely to be. It may well be a known vacation destination. For each place give a wikipedia search link with the mostly likely name for that place. Format the links with <a href... tags'

export const sendImgToOpenAI = async (base64Image) => {
  if (debug) {
    return 'Based on the image provided, it appears to be a modern city with a skyline featuring skyscrapers and bright lights, which is characteristic of many major cities around the world. Here are three places that this image could likely represent, along with Wikipedia links for more information:\n\n1. Shanghai, China - Known for its impressive skyline, including the Shanghai Tower and the Oriental Pearl Tower.\n<a href="https://en.wikipedia.org/wiki/Shanghai">Shanghai - Wikipedia</a>\n\n2. Hong Kong - Famous for its dense skyline and as a major financial hub with Victoria Harbour.\n<a href="https://en.wikipedia.org/wiki/Hong_Kong">Hong Kong - Wikipedia</a>\n\n3. Singapore - Recognized for its modern architecture, including the Marina'
  }

  console.log('service/questionText:', base64Image.length)
  try {
    const prompt = [
      {
        role: 'user',
        content: [
          { type: 'text', text: visionPrompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ]

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    }

    const response = await axios.post(openaiEndpoint, {
      model: 'gpt-4-vision-preview',
      messages: prompt,
      max_tokens: 150,
      temperature: 0.0
    }, { headers })

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    throw new Error('Internal Server Error S')
  }
}
export const visionService = {
  sendImgToOpenAI
}
