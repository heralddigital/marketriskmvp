import config from '@payload-config'
import { GraphQLClient } from '@payloadcms/next/routes'

export const { GET, POST } = GraphQLClient(config)
