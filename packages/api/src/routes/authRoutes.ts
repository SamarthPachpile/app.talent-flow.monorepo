import { Router } from "express";
import passport from "passport";
import { AuthController, validateSessionEndpoint } from "../controllers/authController";

export const authRouter = Router();

// Standard Auth Endpoints
authRouter.post(
  ["/signup", "/candidate-signup", "/company-signup", "/register"],
  AuthController.signUp,
);
authRouter.post(
  ["/signup-details", "/signup-full", "/register-full", "/signup/full"],
  AuthController.signUpWithFullDetails,
);
authRouter.post(
  ["/signin", "/candidate-signin", "/company-signin", "/admin-signin", "/login"],
  AuthController.signIn,
);
authRouter.post(["/google", "/google-auth", "/google-signin"], AuthController.googleAuth);
authRouter.get(["/me", "/verify-token", "/current-user"], AuthController.getMe);
authRouter.post(
  ["/signout", "/candidate-signout", "/company-signout", "/admin-signout", "/logout"],
  AuthController.signOut,
);

// Google OAuth Configuration
authRouter.get(["/google/config", "/google-config"], (req, res) => {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
  const isConfigured = Boolean(clientId && !clientId.startsWith("mock_"));
  res.json({
    clientId: isConfigured ? clientId : "",
    isConfigured,
  });
});

// Session Verification
authRouter.get(
  ["/session/validate", "/validate-session", "/session-check"],
  validateSessionEndpoint,
);
authRouter.post(
  ["/session/validate", "/validate-session", "/session-check"],
  validateSessionEndpoint,
);

// Verification & Security
authRouter.post(["/verify-email", "/send-verification"], AuthController.sendVerificationEmail);
authRouter.get(["/check-verified", "/verify-status"], AuthController.checkEmailVerified);
authRouter.get(
  ["/verify-email-confirm", "/confirm-email", "/verify-link", "/email-confirm"],
  AuthController.confirmEmailVerification,
);
authRouter.post(
  ["/verify-email-confirm", "/confirm-email", "/verify-link", "/email-confirm"],
  AuthController.confirmEmailVerification,
);
authRouter.post(["/update-email", "/change-email"], AuthController.updateUserEmailAndResend);
authRouter.post(["/otp/send", "/send-otp"], AuthController.sendOtpCode);
authRouter.post(["/otp/verify", "/verify-otp"], AuthController.verifyOtpCode);

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
