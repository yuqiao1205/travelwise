// service.js
import f from 'api'
import dotenv from 'dotenv'

dotenv.config()
const YELP_API_KEY = process.env.YELP_API_KEY

const sdk = f('@yelp-developers/v1.0#8e0h2zlqcimwm0')

sdk.auth('Bearer ' + YELP_API_KEY)

export async function fetchBusinesses (term, location, page) {
  const itemPerPage = 5
  const offset = (page - 1) * itemPerPage
  const response = await sdk.v3_business_search({
    location,
    term,
    sort_by: 'best_match',
    limit: itemPerPage,
    offset
  })

  const totalPages = Math.min(Math.ceil(response.data.total / itemPerPage), 10)

  return {
    businesses: response.data.businesses,
    totalPages
  }
}

export const yelp = { fetchBusinesses }
