import mongoose from 'mongoose'
import trackedUserSchema from './schema'

const TrackedUser = mongoose.model('TrackedUser', trackedUserSchema)

export default TrackedUser
