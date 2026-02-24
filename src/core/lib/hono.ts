import { Hono } from 'hono'
import { Context } from '../types/context'

export class App extends Hono<Context> { }
