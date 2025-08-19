import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        let user = await User.findOne({ googleId: profile.id });

        // Fallback: match by email
        if (!user && email) {
          user = await User.findOne({ email });
        }

        if (user) {
          if (!user.googleId) user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          name: profile.displayName || 'Unnamed User',
          email,
          googleId: profile.id,
          provider: 'google',
          role: 'freelancer', // default role (can be updated later)
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
