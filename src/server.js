import routes from './routes'
import Hapi from '@hapi/hapi'

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '172.31.26.78',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.route(routes)

  await server.start()
  return server.info.uri
}

init().then(r => console.log(`Server running at ${r}`))
