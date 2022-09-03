import EventEmitter from 'events'
import { ToadScheduler } from 'toad-scheduler'
import TrackingBot from './TrackingBot'

class Scheduler extends ToadScheduler {
  bots: TrackingBot[] = []
  emitter = new EventEmitter()

  constructor () {
    super()
    console.log('oi')
  }
}

export default new Scheduler()
