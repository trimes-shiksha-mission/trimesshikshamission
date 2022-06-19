import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import depthLimit from 'graphql-depth-limit'
import { graphqlUploadExpress } from 'graphql-upload'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { CORS_ORIGIN, NODE_ENV, PORT } from './config'
import { dataSource } from './dataSource'
import { HelloResolver } from './graphql/resolvers/HelloResolver'
import { VerifiedPhoneResolver } from './graphql/resolvers/VerifiedPhoneResolver'

const main = async () => {
  console.log('Starting server up...')
  await dataSource.initialize()
  console.log('Connected to DB...')

  const schema = await buildSchema({
    resolvers: [HelloResolver, VerifiedPhoneResolver]
  })
  console.log('Graphql Schema build complete...')

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    validationRules: [depthLimit(20)]
  })

  const app = express()

  app.use(
    cors({
      origin: CORS_ORIGIN
    })
  )
  app.use(graphqlUploadExpress())
  app.disable('x-powered-by')

  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    cors: false,
    bodyParserConfig: {
      limit: '256mb'
    }
  })

  app.listen(PORT, () =>
    console.log(
      `${
        NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1)
      } Server Started on Port ${PORT}...`
    )
  )
}

main()
