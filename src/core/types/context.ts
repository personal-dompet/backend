import { User } from '../entities/user-entity'

export type Context = {
  Variables: {
    user: User
  }
}