// Desc: Service for the tags table
import { db } from '../db.js'

const getTagIdByThemeName = (name) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT tagId FROM tags WHERE name = ?'
    // Logging the theme name being queried
    console.log('Executing query to find tagId for theme name:', name)

    db.query(q, [name], (err, result) => {
      if (err) {
        console.error('Error querying for tagId:', err) // Log any errors
        reject(err)
        return
      }

      if (result.length > 0) {
        console.log(`Found tagId for '${name}':`, result[0].tagId) // Log the found tagId
        resolve(result[0].tagId)
      } else {
        console.log(`No tagId found for '${name}'`) // Log if no tagId is found
        resolve(null)
      }
    })
  })
}

export const tag = {
  getTagIdByThemeName
}
