import NextAuth, {AuthOptions, getServerSession} from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
    async signIn({profile}){
      try{
        let userExists = await fetchUserExistsEmail(profile.email);
        if(userExists) {
          const user = await fetchUserByEmail(profile.email);
        }
        if(!userExists) {
          const generatePassword = () =>{
            let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()0123456789';
            let newPassword = "";
            for(let i=0; i<12; i++){
              newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return password;
          }
          const user = await postUser({
            name: profile.name, 
            email: profile.email, 
            country: '', 
            password: generatePassword(), 
            preferences:'', 
            results:''
          });
        }
        return true;
      }
      catch(error){

      }
    }
  },
};
export default (req, res) => NextAuth(req, res, options);