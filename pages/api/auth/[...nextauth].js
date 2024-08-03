import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
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
        const userCredentials = {
            email: credentials.email,
            password: credentials.password,
          };
        const res = await tryLogin(userCredentials.email, userCredentials.password);
        const user = res.content.user;

        if (res && user) {
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
    async session(session, user, token) {
      session.user = token.user;
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);