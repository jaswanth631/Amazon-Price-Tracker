import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/GoogleAuthUser";

const GOOGLE_CLIENT_ID =
  "50195712352-sqjhj7b8ssp07mpaq9mtbp7uopge8ihq.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const CALLBACK_URL = "http://localhost:3000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile: any, done) => {
      const email = profile.emails[0].value;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log("user already exists!!");
        return done(null, existingUser);
      } else {
        try {
          const user = await User.findOrCreate({
            where: { email: profile.emails![0].value, profile_id: profile.id },
            defaults: { name: profile.displayName },
          });
          console.log("new user saved to database,,");
          return done(null, user);
        } catch (error) {
          const err =
            error instanceof Error ? error : new Error("An error occurred");
          return done(err, false);
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(parseInt(id, 10));
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
