import NextAuth, {AuthOptions, getServerSession} from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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

  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },

  callbacks: {
    async session(session, user, token) {
      if(user)
        session.user = user;
      else if(token.user)
        session.user = token.user;
      return await session;
    },
    async jwt({ token, trigger, session, user }) {
        const isSignedIn = user?true:false;
        if(isSignedIn) {token.accessToken = user.id.toString() + "-" + user.email + "-" + user.name;
          token.user = user;
        }
        if(trigger === "update" && session?.name)
          token.user.name = session.name;
        return await token;
    },
    async signIn ({user, account, profile}) {
      try{if(account.provider==="google" || account.provider==="github"){
        const {email, name, image, id} = profile;
        if(!email) throw new Error('Email not provided by OAuth');
        const userExists = await fetch(
          `${process.env.NEXTAUTH_URL}/api/user/${email}`,{
            method: "GET",
            headers:{
              "Content-Type": "application/json",
            },
          }
        );
        if (userExists.status !== 200){
          const generatePassword = () =>{
            let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()0123456789';
            let newPassword = "";
            for(let i=0; i<12; i++){
              newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return newPassword;
          }
          const newUser = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user`,{
              method: "POST",
              body: {
                name: name, 
                email: email, 
                country: '', 
                password: generatePassword(), 
                preferences:'', 
                results:''
              },
              headers:{
                "Content-Type": "application/json",
              },
            }
          );
        }
        return true;
      }
      if(account.provider === "credentials") return true;
      else return false;}
      catch(error){console.error("Sign-in error:", error);
        return false;
      }
    }
  },
  async redirect({url, baseUrl}){
    return baseUrl;
  },
};
export default (req, res) => NextAuth(req, res, options);