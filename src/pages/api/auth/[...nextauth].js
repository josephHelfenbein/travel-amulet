import NextAuth, {AuthOptions} from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../lib/prisma';

let userAcc;
const options = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
          const userCredentials ={
            email: credentials.email,
            password: credentials.password,
          };
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/auth`,
            {
              method: "POST",
              body: JSON.stringify({userCredentials}),
              headers:{
                "Content-Type": "application/json",
              },
            }
          )
          const user = await res.json();
          if (user && res.ok) {
            userAcc = user;
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
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
    encryption: true,
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  callbacks: {
    async session(session, user, token) {
      if(user!==null) {
        session.user = user;
        session.name = user.name;
      }
      return await session;
    },
    async jwt({ token, user }) {
        const isSignedIn = user?true:false;
        if(isSignedIn) token.accessToken = user.id.toString() + "-" + user.email + "-" + user.name;
       return await token;
    },
  },
};
export default (req, res) => NextAuth(req, res, options);