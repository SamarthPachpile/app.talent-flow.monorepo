import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import ScrollToTop from "@graviton/components/ScrollToTop";
import SplashScreen from "@graviton/components/SplashScreen";
import SmoothScrollProvider from "@graviton/components/SmoothScrollProvider";
import CustomCursor from "@graviton/components/CustomCursor";
import SectionNavigator from "@graviton/components/SectionNavigator";
import PageTransition from "@graviton/components/PageTransition";
import AskAIButton from "@graviton/components/AskAIButton";

import { AdminPortalWrapper } from "@graviton/components/AdminPortalWrapper";
import { EcosystemPortalWrapper } from "@graviton/components/EcosystemPortalWrapper";

import Index from "@graviton/pages/Index";
import About from "@graviton/pages/About";
import Careers from "@graviton/pages/Careers";
import ChatbotTest from "@graviton/pages/ChatbotTest";
import Contact from "@graviton/pages/Contact";
import Industries from "@graviton/pages/Industries";
import IndustryDetail from "@graviton/pages/IndustryDetail";
import Insights from "@graviton/pages/Insights";
import Services from "@graviton/pages/Services";
import VelocityAI from "@graviton/pages/VelocityAI";
import NotFound from "@graviton/pages/NotFound";

const isDevAllMode =
  import.meta.env.VITE_DEV_ALL === "true" ||
  import.meta.env.VITE_ENABLE_ECOSYSTEM_ROUTES === "true";

function GravitonWebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="graviton-scope min-h-screen bg-background text-foreground font-sans">
      <SplashScreen>
        <CustomCursor />
        <SectionNavigator />
        <PageTransition>{children}</PageTransition>
        <AskAIButton />
      </SplashScreen>
    </div>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Ecosystem Package Routes — Enabled ONLY when full project (npm run dev:all) is running */}
          {isDevAllMode && (
            <>
              <Route path="/admin-panel/*" element={<AdminPortalWrapper />} />
              <Route
                path="/companies/*"
                element={<EcosystemPortalWrapper routePath="/companies" />}
              />
              <Route
                path="/company/*"
                element={<EcosystemPortalWrapper routePath="/companies" />}
              />
              <Route
                path="/candidates/*"
                element={<EcosystemPortalWrapper routePath="/candidates" />}
              />
              <Route
                path="/candidates-portal/*"
                element={<EcosystemPortalWrapper routePath="/candidates-portal" />}
              />
              <Route
                path="/candidate-portal/*"
                element={<EcosystemPortalWrapper routePath="/candidate-portal" />}
              />
            </>
          )}

          {/* Graviton Landing Website Routes */}
          <Route
            path="/*"
            element={
              <GravitonWebsiteLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/industries" element={<Industries />} />
                  <Route path="/industries/:slug" element={<IndustryDetail />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/velocity-ai" element={<VelocityAI />} />
                  <Route path="/chatbot-test" element={<ChatbotTest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </GravitonWebsiteLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </SmoothScrollProvider>
  );
}
