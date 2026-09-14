import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Company, Candidate } from "@talent-flow/schema-types/models";

const JWT_SECRET = process.env.JWT_SECRET || "talentflow_super_secret_jwt_key_2026_production";
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "mock_google_client_id.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "mock_google_client_secret";
const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
const defaultBaseUrl = isProd
  ? "https://app-talent-flow-monorepo-api.vercel.app"
  : "http://localhost:5000";

const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  (process.env.VITE_API_URL
    ? `${process.env.VITE_API_URL.replace(/\/+$/, "")}/api/auth/google/callback`
    : `${defaultBaseUrl}/api/auth/google/callback`);

export function configurePassport(): typeof passport {
  passport.serializeUser((entity: { id?: string; _id?: unknown }, done) => {
    done(null, entity.id || (entity._id ? String(entity._id) : undefined));
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const candidate = await Candidate.findOne({ $or: [{ id }, { _id: id }] });
      if (candidate) return done(null, candidate);
      const company = await Company.findOne({ $or: [{ id }, { _id: id }] });
      if (company) return done(null, company);
      done(null, null);
    } catch (err) {
      done(err, null);
    }
  });

  // Local Strategy: searches Candidates first, then Companies
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

          // 1. Candidate check
          const candidate = await Candidate.findOne({ email: cleanEmail });
          if (candidate) {
            if (!candidate.password) {
              return done(null, false, {
                message: "Account was registered using Google OAuth. Please sign in with Google.",
              });
            }
            const isMatch = await candidate.comparePassword(password);
            if (!isMatch) {
              return done(null, false, {
                message: "Invalid email or password. Please check your credentials.",
              });
            }
            return done(null, candidate);
          }

          // 2. Company check
          const company = await Company.findOne({
            $or: [{ "admin.workEmail": cleanEmail }, { subdomain: cleanEmail }, { id: cleanEmail }],
          });
          if (company) {
            if (!company.password) {
              return done(null, false, {
                message: "Account was registered using Google OAuth. Please sign in with Google.",
              });
            }
            const isMatch = await company.comparePassword(password);
            if (!isMatch) {
              return done(null, false, {
                message: "Invalid email or password. Please check your credentials.",
              });
            }
            return done(null, company);
          }

          return done(null, false, {
            message: "Invalid email or password. Please check your credentials.",
          });
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  // Google OAuth Strategy: routes directly to Candidate or Company
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
            "Google Account";
          const googleId = profile.id;
          const avatarUrl = profile.photos?.[0]?.value || "";

          const roleFromState = (req.query?.state as string) || "candidate";

          if (!email) {
            return done(new Error("No email returned from Google profile"), undefined);
          }

          if (roleFromState === "candidate") {
            let candidate = await Candidate.findOne({ $or: [{ googleId }, { email }] });
            if (candidate) {
              if (!candidate.googleId) candidate.googleId = googleId;
              if (!candidate.avatarUrl && avatarUrl) candidate.avatarUrl = avatarUrl;
              candidate.emailVerified = true;
              await candidate.save();
              return done(null, candidate);
            }

            const cleanId = `cand-${Date.now().toString().slice(-6)}-${email.replace(/[^a-z0-9]/g, "").slice(0, 8)}`;
            candidate = await Candidate.create({
              id: cleanId,
              fullName,
              email,
              avatarUrl,
              googleId,
              emailVerified: true,
              isCompleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            return done(null, candidate);
          } else {
            let company = await Company.findOne({
              $or: [{ googleId }, { "admin.workEmail": email }],
            });
            if (company) {
              if (!company.googleId) company.googleId = googleId;
              company.emailVerified = true;
              await company.save();
              return done(null, company);
            }

            const compSlug = fullName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-")
              .slice(0, 30);
            const cleanCompSlug = `comp-${Date.now().toString().slice(-6)}-${compSlug}`;
            company = await Company.create({
              id: cleanCompSlug,
              name: `${fullName}'s Workspace`,
              subdomain: cleanCompSlug,
              domain: email.split("@")[1] || "company.com",
              googleId,
              admin: {
                fullName,
                workEmail: email,
                avatarUrl,
                uid: cleanCompSlug,
              },
              emailVerified: true,
              isCompleted: false,
            });
            return done(null, company);
          }
        } catch (err) {
          return done(err as Error, undefined);
        }
      },
    ),
  );

  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          if (jwtPayload.role === "candidate" || jwtPayload.candidateId) {
            const candidate = await Candidate.findOne({
              $or: [{ id: jwtPayload.candidateId || jwtPayload.id }, { email: jwtPayload.email }],
            });
            if (candidate) return done(null, candidate);
          }

          if (jwtPayload.role === "company" || jwtPayload.companyId) {
            const company = await Company.findOne({
              $or: [
                { id: jwtPayload.companyId || jwtPayload.id },
                { "admin.workEmail": jwtPayload.email },
              ],
            });
            if (company) return done(null, company);
          }

          if (jwtPayload.role === "admin") {
            return done(null, { id: jwtPayload.id, email: jwtPayload.email, role: "admin" });
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
