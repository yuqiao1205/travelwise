import { visionService } from '../services/vision.js'
import sharp from 'sharp'

// app.post('/visionupload', visionUpload.single('image'), async (req, res) => {
export const sendImg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    // Resize the image using sharp
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 512, height: 512 }) // Adjust the width and height as needed
      .toBuffer()

    // Convert the resized image buffer to base64
    const base64Image = resizedImageBuffer.toString('base64')

    // Delete the file from memory (since we're not storing it)
    delete req.file

    const assistantResponse = await visionService.sendImgToOpenAI(base64Image)
    res.status(200).json({ success: true, answer: assistantResponse })
  } catch (error) {
    console.error('Error processing image:', error)
    res.status(500).json({ success: false, error: 'Internal server error from C' })
  }
}
