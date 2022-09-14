import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connect = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ytyyeyl.mongodb.net/${process.env.DB_NAME}`
  )
}

export default connect
