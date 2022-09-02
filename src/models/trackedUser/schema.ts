import mongoose from 'mongoose'

const { Schema } = mongoose

const trackedUserSchema = new Schema({
  name: String,
  email: String,
  followers: [
    {
      login: String,
      html_url: String
    }
  ],
  checkedAt: { type: Number, default: null },
  createdAt: Number,
  updatedAt: { type: Number, default: null }
})

export default trackedUserSchema
