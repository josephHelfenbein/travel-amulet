import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../lib/prisma';

const options = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {label:"Email", type:"text"},
        password: {label:"Password", type:"password"}
      },
      async authorize(credentials, req) {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    encryption: true,
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  callbacks: {
    async session(session, user, token) {
      if (user !== null) {
        session.user = user;
      }
      return await session;
    },

    async jwt({ token, user }) {
        const isSignedIn = user ? true : false;
        if(isSignedIn){
            token.accessToken =
                user.id.toString() + "-" + user.email + "-" + user.name;
        }
       return await token;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);