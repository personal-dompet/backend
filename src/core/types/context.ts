import { User } from '../schemas/user'

export type Context = {
  Variables: {
    user: User
  }
}