import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connect = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env['DB-USERNAME']}:${process.env['DB-PASSWORD']}@cluster0.ytyyeyl.mongodb.net/${process.env['DB-NAME']}`
  )
}

export default connect
