import express from 'express'
import cors from 'cors'
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

  private setDatabaseConnection = async () => {
    try {
      await connect()
    } catch (err) {
      console.log(err.message)
    }
  }

  private setMiddlewares = () => {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private setRoutes = () => {
    this.express.use('/', routes)
  }
}

export default new App().express
