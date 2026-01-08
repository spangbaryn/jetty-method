import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 's2c00hdo',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
