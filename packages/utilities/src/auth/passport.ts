import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import type { IUser } from "@talent-flow/schema-types";
import { User, Company, Candidate } from "@talent-flow/schema-types/models";

const JWT_SECRET = process.env.JWT_SECRET || "talentflow_super_secret_jwt_key_2026_production";
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "mock_google_client_id.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "mock_google_client_secret";
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

export function configurePassport(): typeof passport {
  passport.serializeUser((user: { id?: string; _id?: unknown }, done) => {
    done(null, user.id || (user._id ? String(user._id) : undefined));
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (email, password, done) => {
        try {
          const cleanEmail = email.trim().toLowerCase();
          const user = await User.findOne({ email: cleanEmail });

          if (!user) {
            return done(null, false, {
              message: "Invalid email or password. Please check your credentials.",
            });
          }

          if (!user.password) {
            return done(null, false, {
              message: "Account was registered using Google OAuth. Please sign in with Google.",
            });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, {
              message: "Invalid email or password. Please check your credentials.",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase() || "";
          const fullName =
            profile.displayName ||
            `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim() ||
            "Google User";
          const googleId = profile.id;
          const avatarUrl = profile.photos?.[0]?.value || "";

          const roleFromState = (req.query?.state as string) || "company";
          const role = roleFromState === "candidate" ? "candidate" : "company";

          if (!email) {
            return done(new Error("No email returned from Google profile"), undefined);
          }

          let user = await User.findOne({ $or: [{ googleId }, { email }] });

          if (user) {
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
            user.emailVerified = true;
            await user.save();
            return done(null, user);
          }

          user = await User.create({
            email,
            fullName,
            role,
            googleId,
            avatarUrl,
            emailVerified: true,
          });

          if (role === "candidate") {
            const cleanId = email.replace(/[^a-z0-9]/g, "");
            const existingCandidate = await Candidate.findOne({ email });
            if (!existingCandidate) {
              await Candidate.create({
                id: cleanId,
                fullName,
                email,
                avatarUrl,
                uid: user._id.toString(),
                emailVerified: true,
                isCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error, undefined);
        }
      },
    ),
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );

  return passport;
}

export default configurePassport;
