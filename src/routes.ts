import express from 'express'
import usersController from './controllers/UsersController'

const router = express.Router()

router.post('/users/register', usersController.register)
router.delete('/users/unregister', usersController.unregister)
router.put('/users/update', usersController.update)

export default router
