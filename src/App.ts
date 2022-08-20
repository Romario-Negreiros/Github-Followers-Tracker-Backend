import express from 'express'
import connect from './database'
import routes from './routes'

import type { Express } from 'express'

class App {
  express: Express

  constructor () {
    this.express = express()

    this.setDatabaseConnection()
    this.setMiddlewares()
    this.setRoutes()
  }

  private async setDatabaseConnection () {
    try {
      await connect()
      console.log('conectado')
    } catch (err) {
      console.log(err.message)
    }
  }

  private setMiddlewares () {
    this.express.use(express.json())
  }

  private setRoutes () {
    this.express.use('/', routes)
  }
}

export default new App().express
