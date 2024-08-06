import 'next-auth'
import NextAuth from "next-auth"
import * as auth from 'next-auth';

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export * from 'next-auth'
  export default NextAuth
  interface user{
    id: Number,
    email: string,
    name: string,
    country: string,
    preferences: string,
    results: string,
  }
  interface Session {
    user: {
      id: Number,
      email: string,
      name: string,
      country: string,
      preferences: string,
      results: string,
    }
  }
}
declare module 'next-auth/client'{
  export * from 'next-auth/client'
  export interface Session{
    user: {
      id: Number,
      email: string,
      name: string,
      country: string,
      preferences: string,
      results: string,
    }
  }
  export interface user{
    id: Number,
    email: string,
    name: string,
    country: string,
    preferences: string,
    results: string,
  }
}