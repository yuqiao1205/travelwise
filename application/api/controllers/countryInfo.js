import { countryInfoService } from '../services/countryInfoService.js'

export const getCountryDetails = async (req, res) => {
  try {
    const countryName = req.query.selectedCountry

    if (!countryName) {
      return res.status(400).json({ success: false, error: 'Country name is required' })
    }

    const countryDetails = await countryInfoService.getCountryDetails(countryName)

    if (!countryDetails) {
      console.log('countryDetails not found', countryName)
      return res.status(404).json({ success: false, error: 'Country not found' })
    }
    console.log('Country details:', countryDetails)

    res.json({
      success: true,
      countryDetails
    })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}
