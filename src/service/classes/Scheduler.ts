import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import TrackingBot from './TrackingBot'
import TrackedUser from '../../models/trackedUser'

class Scheduler extends ToadScheduler {
  private bots: TrackingBot[] = []

  addScheduleForSavedUsers = async () => {
    const users = await TrackedUser.find({})
    for (const user of users) {
      const bot = new TrackingBot(user.name as string, user.email as string)
      if (bot.userNotFound) {
        await TrackedUser.deleteOne({ email: user.email })
      } else {
        this.addSchedule(bot)
      }
    }
  }

  addSchedule = async (bot: TrackingBot) => {
    const asyncTask = this.createAsyncTask(bot)
    const job = this.createJob(asyncTask, bot.getUserEmail())
    this.addSimpleIntervalJob(job)
    this.bots.push(bot)
  }

  createAsyncTask = (bot: TrackingBot) => {
    return new AsyncTask(
      `Track ${bot.getUserName()}'s followers list changes`,
      () => bot.checkGithubProfile()
    )
  }

  createJob = (task: AsyncTask, id: string) => {
    return new SimpleIntervalJob({ days: 1 }, task, id)
  }

  removeJob = (id: string) => this.removeById(id)

  removeBot = (email: string) => {
    this.bots = this.bots.filter(bot => {
      if (bot.getUserEmail() === email) {
        return null
      } else {
        return bot
      }
    })
  }
}

export default new Scheduler()
