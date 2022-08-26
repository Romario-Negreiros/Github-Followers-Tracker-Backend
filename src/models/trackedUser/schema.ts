import mongoose from 'mongoose'

const { Schema } = mongoose

const trackedUserSchema = new Schema({
  name: String,
  email: String,
  followers: [{
    login: String,
    avatar_url: { type: String, default: null }
  }],
  following: [{
    login: String,
    avatar_url: { type: String, default: null }
  }],
  checkedAt: { type: Date, default: null },
  createdAt: Date,
  updatedAt: { type: Date, default: null }
})

export default trackedUserSchema
