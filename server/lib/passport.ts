import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { db } from "./db";
import bcrypt from "bcryptjs";
import type { Profile as GithubProfile } from "passport-github2";
import type { User as MyUser } from ".prisma/client";

declare global {
  namespace Express {
    interface User extends MyUser {}
  }
}

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return done(null, false, { message: "Invalid email" });
      }

      if (!user.password) {
        return done(null, false, { message: "No password set" });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return done(null, false, { message: "Invalid password" });
      }
      return done(null, user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const userEmail = profile.emails?.[0]?.value;
      if (!userEmail) {
        return done(null, false, { message: "No email was present in google" });
      }
      const user = await db.user.upsert({
        where: { email: userEmail },
        update: { email: userEmail },
        create: {
          email: userEmail,
          image: profile.photos?.[0]?.value,
          name: profile.displayName,
          googleId: profile.id,
        },
      });
      return done(null, user);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GithubProfile,
      done: (err: any, user?: any, info?: any) => void
    ) => {
      const userEmail = profile.emails?.[0]?.value;
      if (!userEmail) {
        return done(null, false, { message: "No email was present in github" });
      }
      const user = await db.user.upsert({
        where: { email: userEmail },
        update: { email: userEmail },
        create: {
          email: userEmail,
          image: profile.photos?.[0]?.value,
          name: profile.displayName,
          githubId: profile.id,
        },
      });
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const dbUser = await db.user.findUnique({
    where: { id: id },
  });
  if (!dbUser) {
    return done(null, false);
  }
  done(null, dbUser);
});

export default passport;
