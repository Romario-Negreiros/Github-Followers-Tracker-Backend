import { AxiosError as AxiosErrorClass, AxiosResponse } from 'axios'

export interface GithubAPIError {
  message: string
  documentation_url: string
}

export interface AxiosError extends AxiosErrorClass {
  response: AxiosResponse<GithubAPIError>
}
