import TrackedUser from '../models/trackedUser'

import type { Request, Response } from 'express'

class UsersController {
  register = async (req: Request, res: Response) => {
    const { name, email } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing either name or email field!' })
    }

    if (await TrackedUser.findOne({ email }).exec()) {
      return res.status(409).json({ error: 'User is already registered!' })
    }

    const trackedUser = new TrackedUser({ name, email })
    try {
      await trackedUser.save()
      return res.status(201).send('User added to tracking list, you\'ll receive updates about your github profile every hour!')
    } catch (err) {
      return res.status(500).json({ error: 'Failed to register new tracked user!' })
    }
  }

  unregister = async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Missing email field!' })
    }

    const user = await TrackedUser.findOneAndDelete({ email })
    if (!user) {
      return res.status(404).json({ error: 'This user is not registered!' })
    }

    return res.status(204).send('User succesfully unregistered!')
  }
}

export default new UsersController()