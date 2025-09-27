import { Hono } from 'hono'
import { User } from '../entities/user-entity'

export function honoApp() {
  return new Hono<{
    Variables: {
      user: User
    }
  }>()
}