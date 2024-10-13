import express from 'express'
const router = express.Router()

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  next()
})

router.get('/', (req, res) => {
  const intervalId = setInterval(() => {
    const dateTimeString = new Date().toISOString()
    res.write(`data: ${dateTimeString}\n\n`)
  }, 1000)

  res.write('data: Connected\n\n')

  req.on('close', () => {
    clearInterval(intervalId)
    console.log('Client disconnected')
  })
})

export default router
