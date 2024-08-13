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
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      id: "github",
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

  callbacks: {
    async session(session, user, token) {
      session.user = user;
      return await session;
    },
    async jwt({ token, trigger, session, user }) {
        const isSignedIn = user?true:false;
        if(isSignedIn) token.accessToken = user.id.toString() + "-" + user.email + "-" + user.name;
        if(trigger === "update" && session?.name)
          token.user.name = session.name;
        return await token;
    },
    signIn: async ({user, account, profile}) => {
      if(account.provider==="google" || account.provider==="github"){
        const {email, name, image, id} = profile;
        let userExists = await fetchUserExistsEmail(email);
        if(!userExists) {
          const generatePassword = () =>{
            let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()0123456789';
            let newPassword = "";
            for(let i=0; i<12; i++){
              newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return newPassword;
          }
          const newUser = await postUser({
            name: name, 
            email: email, 
            country: '', 
            password: generatePassword(), 
            preferences:'', 
            results:''
          });
        }
        return true;
      }
      if(account.provider === "credentials") return true;
      else return false;
    }
  },
  async redirect({url, baseUrl}){
    return baseUrl;
  },
};
export default (req, res) => NextAuth(req, res, options);