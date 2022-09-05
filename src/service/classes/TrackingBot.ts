import axios from 'axios'
import TrackedUser from '../../models/trackedUser'
import { generatePDF, sendEmail, logError } from '../utils'

import type { Follower, Following, User } from '../types/GithubAPIResponses'

class TrackingBot {
  private name: string
  private email: string
  userNotFound: boolean
  private pathToQueryUser: string
  private axiosRequestConfig = {
    headers: {
      accept: 'application/vnd.github+json'
    }
  }

  constructor (name: string, email: string, saveInitialData?: boolean) {
    this.name = name
    this.email = email
    this.pathToQueryUser = `https://api.github.com/users/${this.name}`

    if (saveInitialData) this.saveInitialData()
  }

  getUserEmail = () => this.email

  getUserName = () => this.name

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
          data.forEach(follower => {
            followersResponse.push({
              login: follower.login,
              html_url: follower.html_url
            })
          })
        }
        let { follows, unfollows } = this.getFollowersListChanges(followersResponse, user.followers as Follower[])
        const response = await this.setIsYouFollowing(follows, unfollows, following)
        follows = response.follows
        unfollows = response.unfollows
        await generatePDF(this.name, follows, unfollows)
        await sendEmail({ name: this.name, email: this.email })

        const checkedAt = Date.now()
        user.checkedAt = checkedAt
        user.followers = followersResponse
        user.save()
      }
    } catch (err) {
      logError(err)
    }
  }

  private saveInitialData = async () => {
    try {
      const { data: user } = await axios.get<User>(this.pathToQueryUser, this.axiosRequestConfig)
      const pages = Math.ceil(user.followers / 100)
      const followers: Follower[] = []
      for (let page = 1; page <= pages; page++) {
        const { data } = await axios.get<Follower[]>(
          `${this.pathToQueryUser}/followers?per_page=100&page=${page}`,
          this.axiosRequestConfig
        )
        data.forEach(follower => {
          followers.push({
            login: follower.login,
            html_url: follower.html_url
          })
        })
      }
      await TrackedUser.findOneAndUpdate(
        { email: this.email },
        {
          followers: followers.map(follower => {
            return {
              login: follower.login,
              html_url: follower.html_url
            }
          })
        }
      )
    } catch (err) {
      if (err.response.status === 404) {
        this.userNotFound = true
      } else {
        logError(err)
      }
    }
  }

  private getFollowersListChanges = (followersResponse: Follower[], savedFollowers: Follower[]) => {
    const follows: Follower[] = followersResponse.filter(follower => {
      if (!savedFollowers.some(savedFollower => savedFollower.login === follower.login)) {
        return follower
      }
      return null
    })

    const unfollows: Follower[] = savedFollowers.filter(savedFollower => {
      if (!followersResponse.some(follower => follower.login === savedFollower.login)) {
        return savedFollower
      }
      return null
    })

    return {
      follows,
      unfollows
    }
  }

  private setIsYouFollowing = async (follows: Follower[], unfollows: Follower[], following: number) => {
    const pages = Math.ceil(following / 100)
    const followings: Following[] = []
    for (let page = 0; page <= pages; page++) {
      const { data } = await axios.get<Following[]>(
        `${this.pathToQueryUser}/following?per_page=100&page=${page}`,
        this.axiosRequestConfig
      )
      data.forEach(following => {
        followings.push({
          login: following.login,
          html_url: following.html_url
        })
      })
    }
    const response = {
      follows: follows.map(follower => {
        if (!followings.some(following => following.login === follower.login)) {
          return { ...follower, isYouFollowing: false }
        } else {
          return { ...follower, isYouFollowing: true }
        }
      }),
      unfollows: unfollows.map(unfollower => {
        if (followings.some(following => following.login === unfollower.login)) {
          return {
            ...unfollower,
            isYouFollowing: true
          }
        }
        return unfollower
      })
    }

    return response
  }
}

export default TrackingBot
