import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, {AuthOptions} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../lib/prisma';
import {tryLogin} from '../../../lib/http';

const options = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials, req) {
        if(!credentials?.email||!credentials?.password)
          return null;

        const res = await tryLogin(credentials.email, credentials.password);
        const user = res?.content?.user; 

        if (user) {
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
    async jwt({ token, user }) {
        if(user) token.user = user;
       return token;
    },
    async session(session, token) {
      session.user = token.user;
      return session;
    },
  },
};

export default async (req, res) => {
  try {
    console.log('Request received:', req.url);

    // Capture the result of NextAuth and log it
    const result = await NextAuth(req, res, options);
    console.log('NextAuth result:', result);

    // Manually end the response to avoid any issues with double sending
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).end(JSON.stringify(result));
    }
  } catch (error) {
    console.error("NextAuth error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};