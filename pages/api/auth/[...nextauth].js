import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign In with your credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // TODO: switch to axios
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON?.stringify({ email, password }),
          }
        );

        const user = await response?.json();

        if (response?.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
