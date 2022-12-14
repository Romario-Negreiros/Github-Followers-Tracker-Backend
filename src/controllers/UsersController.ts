import TrackedUser from '../models/trackedUser'
import { TrackingBot, scheduler } from '../service/classes'
import { logError } from '../service/utils'

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

    try {
      const bot = new TrackingBot(name, email)
      await bot.saveInitialData()
      scheduler.addSchedule(bot)

      const createdAt = Date.now()
      const trackedUser = new TrackedUser({ name, email, createdAt })

      await trackedUser.save()
      return res
        .status(201)
        .json({ message: "Profile added to tracking list, you'll receive updates about your github profile every hour!" })
    } catch (err) {
      logError(err)

      if (err.response.status === 404) {
        return res.status(404).json({ error: 'This user does not have a github acount!' })
      }
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

      return res.status(204).json({ message: 'Your profile was removed from our tracking list!' }).append('Access-Control-Allow-Origin', '*')
    } catch (err) {
      logError(err)
      return res.status(500).json({ error: 'Unable to unregister user!' })
    }
  }

  update = async (req: Request, res: Response) => {
    const { email, newName, newEmail } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Missing either name or email field!' })
    }

    const updatedAt = Date.now()
    try {
      const user = await TrackedUser.findOne({ email })
      if (!user) {
        return res.status(404).json({ error: 'This user is not registered!' })
      }
      scheduler.removeJob(email)
      scheduler.removeBot(email)

      const bot = new TrackingBot(newName || (user.name as string), newEmail || email)
      await bot.saveInitialData()
      scheduler.addSchedule(bot)

      if (newName) {
        user.name = newName
      }

      if (newEmail) {
        user.email = newEmail
      }

      user.updatedAt = updatedAt

      await user.save()

      return res.status(204).json({ message: 'Your profile was succesfully updated!' })
    } catch (err) {
      logError(err)
      return res.status(500).json({ error: "Unable to update user's profile!" })
    }
  }
}

export default new UsersController()
