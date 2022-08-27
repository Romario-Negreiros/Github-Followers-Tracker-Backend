import axios from 'axios'
import TrackedUser from '../models/trackedUser'

import type { Follower, Following } from './types/GithubAPIResponses'

class TrackingBot {
  private name: string
  private email: string
  private pathToQueryUser: string

  constructor (name: string, email: string) {
    this.name = name
    this.email = email
    this.pathToQueryUser = `https://api.github.com/users/${this.name}`

    this.initTracking()
  }

  getTrackedUser = () => this.name

  private getFollowersListChanges = (
    followersResponse: Follower[],
    savedFollowers: Follower[]
  ) => {
    const follows: Follower[] = followersResponse.filter(follower => {
      if (
        !savedFollowers.some(
          savedFollower => savedFollower.login === follower.login
        )
      ) {
        return follower
      }
      return null
    })

    const unfollows: Follower[] = savedFollowers.filter(savedFollower => {
      if (
        !followersResponse.some(
          follower => follower.login === savedFollower.login
        )
      ) {
        return savedFollower
      }
      return null
    })

    return {
      follows,
      unfollows
    }
  }

  private setIsYouFollowing = async (
    follows: Follower[],
    unfollows: Follower[]
  ) => {
    const followingResponse = await axios.get<Following[]>(
      `${this.pathToQueryUser}/following`
    )

    follows.forEach(follower => {
      if (
        !followingResponse.data.some(
          following => following.login === follower.login
        )
      ) {
        follower.isYouFollowing = false
      } else {
        follower.isYouFollowing = true
      }
    })

    unfollows.forEach(unfollower => {
      if (
        !followingResponse.data.some(
          following => following.login === unfollower.login
        )
      ) {
        unfollower.isYouFollowing = false
      } else {
        unfollower.isYouFollowing = true
      }
    })
  }

  private initTracking = async () => {
    try {
      const { data: followers } = await axios.get<Follower[]>(
        `${this.pathToQueryUser}/followers`
      )
      const checkedAt = Date.now()
      await TrackedUser.findOneAndUpdate(
        { email: this.email },
        {
          followers: followers.map(follower => {
            return {
              login: follower.login,
              avatar_url: follower.avatar_url
            }
          }),
          checkedAt
        }
      )
    } catch (err) {
      // TO-DO handle errors properly
      console.log(err.message)
    }
  }

  checkGithubProfile = async () => {
    try {
      const followersResponse = await axios.get<Follower[]>(
        `${this.pathToQueryUser}/followers`
      )
      const user = await TrackedUser.findOne({ email: this.email })
      if (user) {
        const { follows, unfollows } = this.getFollowersListChanges(
          followersResponse.data,
          user.followers as Follower[]
        )
        console.log(follows, unfollows)
        if (follows.length || unfollows.length) {
          await this.setIsYouFollowing(follows, unfollows)
        }
        console.log(follows, unfollows)
      }
    } catch (err) {
      // TO-DO handle errors properly
      console.error(err.message)
    }
  }
}

export default TrackingBot
