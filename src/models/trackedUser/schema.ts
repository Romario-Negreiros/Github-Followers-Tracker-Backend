import mongoose from 'mongoose'

const { Schema } = mongoose

const trackedUserSchema = new Schema({
  name: String,
  email: String,
  date: { type: Date, default: Date.now() }
})

export default trackedUserSchema
