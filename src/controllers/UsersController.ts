import TrackedUser from '../models/trackedUser'
import { TrackingBot, scheduler } from '../service/classes'

import type { Request, Response } from 'express'

class UsersController {
  register = async (req: Request, res: Response) => {
    const { name, email } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing either name or email field!' })
    }

    if (await TrackedUser.findOne({ email })) {
      return res.status(409).json({ error: 'User is already registered!' })
    }

    const createdAt = Date.now()
    const trackedUser = new TrackedUser({ name, email, createdAt })
    try {
      await trackedUser.save()

      const bot = new TrackingBot(name, email, true)
      scheduler.addSchedule(bot)

      return res
        .status(201)
        .send("User added to tracking list, you'll receive updates about your github profile every hour!")
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Failed to register user!' })
    }
  }

  unregister = async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Missing email field!' })
    }

    try {
      const user = await TrackedUser.findOne({ email })
      if (!user) {
        return res.status(404).json({ error: 'This user is not registered!' })
      }

      scheduler.removeJob(email)
      scheduler.removeBot(email)

      await user.delete()

      return res.status(204).end()
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Unable to unregister user!' })
    }
  }

  update = async (req: Request, res: Response) => {
    const { name, email, newEmail } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing either name or email field!' })
    }

    const updatedAt = Date.now()
    try {
      const user = await TrackedUser.findOneAndUpdate({ email }, { name, email: newEmail || email, updatedAt })
      if (!user) {
        return res.status(404).json({ error: 'This user is not registered!' })
      }

      scheduler.removeJob(email)
      scheduler.removeBot(email)

      const bot = new TrackingBot(name, newEmail || email)
      scheduler.addSchedule(bot)

      return res.status(204).end()
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: "Unable to update user's profile!" })
    }
  }
}

export default new UsersController()
