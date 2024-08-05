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
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
          if(!credentials?.email||!credentials?.password)
            throw new Error('Invalid credentials');
  
          //const res = await tryLogin(credentials.email, credentials.password);
          const res = await prisma.$queryRaw`SELECT * FROM User WHERE email=${credentials?.email}`;
          
          //const user = res?.content?.user; 
          const user = response.rows[0];
          const passwordCorrect = user.password === sha256(credentials?.password).toString();

          if (user && passwordCorrect) {
            return {
              id: user.id,
              email: user.email,
            };
          }
          console.log("credentials", credentials);
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
export default async (req, res) => {
  try {
    const result = await NextAuth(req, res, options);
    res.setHeader('Content-Type', 'application/json');
    if (!res.headersSent) {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('NextAuth error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};