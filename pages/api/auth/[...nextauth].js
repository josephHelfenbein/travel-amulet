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
  fetch(`${process.env.NEXTAUTH_URL}/api/auth/providers`)
    .then(response =>{
      if(!response.ok) console.log('Network response was not ok');
    return response.json();
    })
    .then(data => {
      console.log('Providers:', data);
    })
    .catch(error =>{
      console.log('Fetch error');
    });

  try{
    res.setHeader('Content-Type', 'application/json');
    await NextAuth(req, res, options);
  }
  catch(error){
    res.status(500).json({message: 'Internal server error'});
  }
}