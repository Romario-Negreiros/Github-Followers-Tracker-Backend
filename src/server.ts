import app from './App'
import bot from './bot'

app.listen(process.env.PORT || 3300, () => bot())
