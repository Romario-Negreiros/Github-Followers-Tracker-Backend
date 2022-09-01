export interface User {
  login: string
  id: number
  node_id: string
  avatar_url: string | null
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  hireable: boolean
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
}

export interface Follower {
  login: string
  html_url: string
  isYouFollowing?: boolean
}

export interface Following extends Omit<Follower, 'isYouFollowing'> {}
