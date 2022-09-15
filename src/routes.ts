import express from 'express'
import usersController from './controllers/UsersController'

const router = express.Router()

router.post('/register', usersController.register)
router.delete('/unregister', usersController.unregister)
router.put('/update', usersController.update)

export default router
