import axios from 'axios'
import TrackedUser from '../models/trackedUser'

import type { Follower, Following } from './types/GithubAPIResponses'

class UserTrackingBot {
  private name: string
  private email: string
  private pathToQueryUser: string

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
    this.pathToQueryUser = `https://api.github.com/users/${this.name}`

    this.initTracking()
  }

  getTrackedUser = () => this.name

  private initTracking = async () => {
    try {
      const { data: following } = await axios.get<Following[]>(
        `${this.pathToQueryUser}/following`
      )
      const { data: followers } = await axios.get<Follower[]>(
        `${this.pathToQueryUser}/followers`
      )
      const checkedAt = Date.now()
      await TrackedUser.findOneAndUpdate(
        { email: this.email },
        { followers, following, checkedAt }
      )
    } catch (err) {
      // TO-DO handle errors properly
      console.log(err.message)
    }
  }

  checkGithubProfile = async () => {
    try {
      const followingResponse = await axios.get<Following[]>(
        `${this.pathToQueryUser}/following`
      )
      const followersResponse = await axios.get<Follower[]>(
        `${this.pathToQueryUser}/followers`
      )
      const user = await TrackedUser.findOne({ email: this.email })
      if (user) {
        // TO-DO decide either to verify changes directly or indirectly
        // directly > look for new follows/unfollows, and if there are any, keep going with the method
        // indirectly > what im doing now, first check if the lists arent the same, if no, get the changes and keep going
        const hasFollowingListChanged = followingResponse.data.every(
          followingResponseUser =>
            user.following.some(
              followingUser => followingResponseUser === followingUser
            )
        )
      }
    } catch (err) {
      // TO-DO handle errors properly
      console.error(err.message)
    }
  }
}

export default UserTrackingBot
