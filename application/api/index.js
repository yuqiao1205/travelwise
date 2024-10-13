import app from './app.js'

const port = 8800

const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Api running at http://localhost:${port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

start(port)
