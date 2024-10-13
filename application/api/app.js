import express from 'express'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
// import qaRoutes from './routes/qa.js'
import likeRoutes from './routes/likes.js'
import searchRoutes from './routes/search.js'
import followRoutes from './routes/relationship.js'
// import locationRoutes from './routes/location.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import cors from 'cors'
import bodyParser from 'body-parser'
import favoritesRoutes from './routes/favorites.js'
import subscriptionsRoutes from './routes/subscription.js'
import chatRoutes from './routes/chatbot.js'
import weatherRoutes from './routes/weather.js'
import countryInfoRoutes from './routes/countryInfo.js'
import yelpRoutes from './routes/yelp.js'
import sse from './routes/sse.js'
import visionRoutes from './routes/vision.js'
import sharp from 'sharp'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!!'), false)
  }
  cb(null, true)
}

// Multer instance for post image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname) // prevent duplicate names date.now()
  }
})

const upload = multer({
  storage,
  fileFilter: imageFileFilter // Add the file filter
})

app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file
  if (!file) {
    return res.status(400).json({ error: 'File must be provided' })
  }

  // const file = req.file
  // res.status(200).json(file.filename)

  // Generate and save thumbnail using sharp
  const thumbnailPath = '../client/public/upload/' + file.filename + '-thumbnail.jpg'
  sharp(file.path)
    .resize(358, 200)
    .toFile(thumbnailPath, (err, info) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: 'Error generating thumbnail' })
      }
      const thubnailFilename = file.filename + '-thumbnail.jpg'
      res.status(200).json({ filename: file.filename, thumbnail: thubnailFilename })
    })
})

// Multer instance for profile image uploads
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/profile')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const profileImageUpload = multer({
  storage: profileImageStorage,
  fileFilter: imageFileFilter // Add the file filter to check for image files or not
})

app.post('/api/profile', profileImageUpload.single('file'), function (req, res) {
  const file = req.file
  res.status(200).json(file.filename)
})

const visionUpload = multer({ storage: multer.memoryStorage(), fileFilter: imageFileFilter })

// Add all the route uses here
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/favorites', favoritesRoutes)
// app.use('/api/location', locationRoutes)

// app.use('/api/qa', qaRoutes)
app.use('/api/subscriptions', subscriptionsRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/vision', visionUpload.single('file'), visionRoutes)
app.use('/api/sse', sse)

app.use('/api/weather', weatherRoutes)
app.use('/api/country', countryInfoRoutes)
app.use('/api/yelpsearch', yelpRoutes)


// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    res.status(400).json({ error: 'Multer error', details: err.message })
  } else if (err.message === 'Only image files are allowed!!') {
    // Handle the custom error for file type validation
    res.status(415).json({ error: err.message })
  } else {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Example server startup, uncomment and modify according to your needs
// app.listen(8800, () => {
//   console.log('Api running at http://localhost:8800');
// });

export default app
