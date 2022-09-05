import app from './App'
import { scheduler } from './service/classes'

app.listen(process.env.PORT || 3300, () => {
  scheduler.addScheduleForSavedUsers()
})
