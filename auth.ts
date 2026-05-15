import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          hd: 'samorzad.ue.wroc.pl',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ profile }) {
      return profile?.email?.endsWith('@samorzad.ue.wroc.pl') ?? false
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.email = profile.email
      }
      return token
    },
  },
})
