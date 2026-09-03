import { Router } from "express";
import passport from "passport";
import { AuthController, validateSessionEndpoint } from "../controllers/authController";
import { sessionValidation } from "../middlewares/sessionMiddleware";

export const authRouter = Router();

// Standard Auth Endpoints
authRouter.post("/signup", AuthController.signUp);
authRouter.post("/signup/full", AuthController.signUpWithFullDetails);
authRouter.post("/signin", AuthController.signIn);
authRouter.post("/login", AuthController.signIn);
authRouter.post("/google", AuthController.googleAuth);
authRouter.post("/signout", AuthController.signOut);
authRouter.post("/logout", AuthController.signOut);

// Google OAuth Configuration
authRouter.get("/google/config", (req, res) => {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
  const isConfigured = Boolean(clientId && !clientId.startsWith("mock_"));
  res.json({
    clientId: isConfigured ? clientId : "",
    isConfigured,
  });
});

// Session Verification
authRouter.get("/session/validate", validateSessionEndpoint);
authRouter.post("/session/validate", validateSessionEndpoint);

// Verification & Security
authRouter.post("/verify-email", AuthController.sendVerificationEmail);
authRouter.get("/check-verified", AuthController.checkEmailVerified);
authRouter.post("/update-email", AuthController.updateUserEmailAndResend);
authRouter.post("/otp/send", AuthController.sendOtpCode);
authRouter.post("/otp/verify", AuthController.verifyOtpCode);

// Passport Google OAuth Redirect Routes (for browser redirect flow if needed)
authRouter.get("/google/redirect", (req, res, next) => {
  const role = (req.query.role as string) || "company";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,
  })(req, res, next);
});

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/error",
  }),
  (req, res) => {
    const user = req.user as { email?: string } | undefined;
    // Redirect back to frontend with token
    res.redirect(`/?auth=google&email=${encodeURIComponent(user?.email || "")}`);
  },
);

export default authRouter;
