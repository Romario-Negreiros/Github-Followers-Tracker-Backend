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
  checkedAt: { type: Date, default: null },
  createdAt: Date,
  updatedAt: { type: Date, default: null }
})

export default trackedUserSchema
