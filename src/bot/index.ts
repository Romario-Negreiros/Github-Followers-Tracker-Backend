import axios from 'axios'

const bot = async () => {
  try {
    const response = await axios.get('https://api.github.com/users/Romario-Negreiros')
    console.log(response.data)
  } catch (err) {
    console.error(err.message)
  }
}

export default bot
