import app from './App'
import TrackingBot from './TrackingBot'
// import TrackedUser from './models/trackedUser'

app.listen(process.env.PORT || 3300, async () => {
  const bot = new TrackingBot('Romario-Negreiros', 'nromario482@gmail.com')
  setTimeout(() => bot.checkGithubProfile(), 5000)
})
