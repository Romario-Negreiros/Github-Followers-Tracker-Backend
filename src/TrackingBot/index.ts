import axios from 'axios'
import TrackedUser from '../models/trackedUser'

import type { Follower, Following, User } from './types/GithubAPIResponses'

class TrackingBot {
  private name: string
  private email: string
  private pathToQueryUser: string
  private axiosRequestConfig = {
    headers: {
      accept: 'application/vnd.github+json'
    }
  }

  constructor (name: string, email: string) {
    this.name = name
    this.email = email
    this.pathToQueryUser = `https://api.github.com/users/${this.name}`

    this.initTracking()
  }

  getTrackedUser = () => this.name

  checkGithubProfile = async () => {
    try {
      const user = await TrackedUser.findOne({ email: this.email })
      const {
        data: { following }
      } = await axios.get<User>(this.pathToQueryUser, this.axiosRequestConfig)
      if (user) {
        const pages = Math.ceil(user.followers.length / 100)
        const followersResponse: Follower[] = []
        for (let page = 1; page <= pages; page++) {
          const { data } = await axios.get<Follower[]>(
            `${this.pathToQueryUser}/followers?per_page=100&page=${page}`,
            this.axiosRequestConfig
          )
          followersResponse.push(...data)
        }
        const { follows, unfollows } = this.getFollowersListChanges(
          followersResponse,
          user.followers as Follower[]
        )
        if (follows.length || unfollows.length) {
          const pages = Math.ceil(following / 100)
          await this.setIsYouFollowing(follows, unfollows, pages)
        }
        console.log(follows, unfollows)
      }
    } catch (err) {
      // TO-DO handle errors properly
      console.error(err.message)
    }
  }

  private initTracking = async () => {
    try {
      const { data: user } = await axios.get<User>(
        this.pathToQueryUser,
        this.axiosRequestConfig
      )
      const pages = Math.ceil(user.followers / 100)
      const followers: Follower[] = []
      for (let page = 1; page <= pages; page++) {
        const { data } = await axios.get<Follower[]>(
          `${this.pathToQueryUser}/followers?per_page=100&page=${page}`,
          this.axiosRequestConfig
        )
        followers.push(...data)
      }
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
    unfollows: Follower[],
    pages: number
  ) => {
    const followings: Following[] = []
    for (let page = 0; page <= pages; page++) {
      const followingResponse = await axios.get<Following[]>(
        `${this.pathToQueryUser}/following?per_page=100&page=${page}`,
        this.axiosRequestConfig
      )
      followings.push(...followingResponse.data)
    }

    follows.forEach(follower => {
      if (!followings.some(following => following.login === follower.login)) {
        follower.isYouFollowing = false
      } else {
        follower.isYouFollowing = true
      }
    })

    unfollows.forEach(unfollower => {
      if (!followings.some(following => following.login === unfollower.login)) {
        unfollower.isYouFollowing = false
      } else {
        unfollower.isYouFollowing = true
      }
    })
  }
}

export default TrackingBot
