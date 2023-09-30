import axios, { AxiosInstance } from 'axios'

const baseURL: string = 'http://0.0.0.0:8080/api/v1'

export function createApiClient(accessToken: string): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}
