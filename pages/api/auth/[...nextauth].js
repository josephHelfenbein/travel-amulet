import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, {AuthOptions} from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import {tryLogin} from '../../../lib/http';
import { SHA256 as sha256 } from 'crypto-js';

const options = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials) {
          if(!credentials?.email||!credentials?.password)
          throw new Error('Invalid credentials');
          const userCredentials ={
            email: credentials.email,
            password: credentials.password,
          };
          const res = await fetch(
            `${process.env.VERCEL_URL}/api/user/login`,
            {
              method: "POST",
              body: JSON.stringify(userCredentials),
              headers:{
                "Content-Type": "application/json",
              },
            }
          )
          const user = await res.json();
          if (user && res.ok) {
            return user;
          }
          return null;
        },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },

  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    encryption: true,
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
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
export default (req, res) => NextAuth(req, res, options);