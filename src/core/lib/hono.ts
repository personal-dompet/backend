import { Hono } from 'hono'
import { Context } from '../types/context'

export function honoApp() {
  return new Hono<Context>()
}