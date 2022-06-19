import { NEXT_PUBLIC_GRAPHQL_API_URL } from './config'

export const fetchRefreshToken = (token: string) =>
  fetch(NEXT_PUBLIC_GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
                mutation {
                  refreshToken (token: "${token}") {
                    userId
                    role
                    email
                    phone
                    firstName
                    lastName
                    accessToken
                    issuedAt
                    expiresAt
                    refreshToken
                  }
                }
            `
    })
  })
