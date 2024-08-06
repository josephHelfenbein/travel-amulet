import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
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