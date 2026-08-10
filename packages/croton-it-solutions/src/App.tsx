import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import ScrollToTop from "@croton/components/ScrollToTop";
import SplashScreen from "@croton/components/SplashScreen";
import SmoothScrollProvider from "@croton/components/SmoothScrollProvider";
import CustomCursor from "@croton/components/CustomCursor";
import SectionNavigator from "@croton/components/SectionNavigator";
import PageTransition from "@croton/components/PageTransition";
import AskAIButton from "@croton/components/AskAIButton";

import { AdminPortalWrapper } from "@croton/components/AdminPortalWrapper";
import { EcosystemPortalWrapper } from "@croton/components/EcosystemPortalWrapper";

import Index from "@croton/pages/Index";
import About from "@croton/pages/About";
import Careers from "@croton/pages/Careers";
import ChatbotTest from "@croton/pages/ChatbotTest";
import Contact from "@croton/pages/Contact";
import Industries from "@croton/pages/Industries";
import IndustryDetail from "@croton/pages/IndustryDetail";
import Insights from "@croton/pages/Insights";
import Services from "@croton/pages/Services";
import VelocityAI from "@croton/pages/VelocityAI";
import NotFound from "@croton/pages/NotFound";

const isDevAllMode =
  import.meta.env.VITE_DEV_ALL === "true" ||
  import.meta.env.VITE_ENABLE_ECOSYSTEM_ROUTES === "true";

function CrotonWebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="croton-scope min-h-screen bg-background text-foreground font-sans">
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

          {/* Croton Landing Website Routes */}
          <Route
            path="/*"
            element={
              <CrotonWebsiteLayout>
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
              </CrotonWebsiteLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </SmoothScrollProvider>
  );
}
