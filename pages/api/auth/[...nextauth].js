import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../src/app/firebase'; // Adjust the path as per your project structure

export default NextAuth({
  pages: {
    signIn: '/auth'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password, isSignUp } = credentials;

        try {
          if (isSignUp) {
            // Sign up user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
              return userCredential.user;
            }
          } else {
            // Sign in user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("In the nextAuth"+ userCredential);
            if (userCredential.user) {
              return userCredential.user;
            }
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.uid;
      }
      return token;
    }
  }
});
