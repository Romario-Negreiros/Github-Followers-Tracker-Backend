import mongoose from 'mongoose'

const { Schema } = mongoose

const trackedUserSchema = new Schema({
  name: String,
  email: String,
  createdAt: Date,
  updatedAt: { type: Date, default: null }
})

export default trackedUserSchema
