import React, { useState } from "react";
import { SystemCredentials } from "../../types/candidate";
import { Mail, QrCode, CheckCircle2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CredentialsStageViewProps {
  credentials: SystemCredentials;
}

export const CredentialsStageView: React.FC<CredentialsStageViewProps> = ({ credentials }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [twoFactorPaired, setTwoFactorPaired] = useState(credentials.twoFactorSetupCompleted);

  const copyEmail = () => {
    navigator.clipboard.writeText(credentials.corporateEmail);
    setCopiedEmail(true);
    toast.success("Corporate email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              <span>Okta SSO Provisioned</span>
            </span>
            <span className="text-xs text-muted-foreground">Security Policy: Enforced 2FA</span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Corporate Credentials & System Access
          </h2>
          <p className="text-xs text-muted-foreground">
            Activate work email, set initial Okta password, and configure two-factor authentication
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Work Email & SSO Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
            <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
              <Mail className="size-4 text-ember" />
              <span>Corporate Identity Account</span>
            </h3>

            <div className="p-3.5 bg-surface rounded-md border border-border flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Assigned Corporate Work Email
                </div>
                <div className="text-sm font-bold text-foreground font-mono mt-0.5">
                  {credentials.corporateEmail}
                </div>
              </div>

              <button
                onClick={copyEmail}
                className="px-3 py-1.5 rounded-md bg-card hover:bg-accent/60 text-foreground text-xs font-medium flex items-center gap-1.5 border border-border transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <Check className="size-3.5 text-success" />
                ) : (
                  <Copy className="size-3.5 text-ember" />
                )}
                <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
              </button>
            </div>

            {/* Application Access Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-surface rounded-md border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-card border border-border text-foreground flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Google Workspace</div>
                    <div className="text-[10px] text-success font-medium">
                      Gmail, Calendar, Drive
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="p-3 bg-surface rounded-md border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-card border border-border text-foreground flex items-center justify-center font-bold text-xs">
                    #
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Slack Workspace</div>
                    <div className="text-[10px] text-success font-medium">Team Communication</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold">
                  INVITED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Authenticator Simulator */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
            <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
              <QrCode className="size-4 text-ember" />
              <span>2FA Authenticator Setup</span>
            </h3>

            <div className="p-3 bg-surface rounded-md border border-border text-center space-y-2">
              <div className="size-28 bg-foreground p-2 mx-auto rounded-md shadow-xs flex items-center justify-center">
                <div className="w-full h-full border-2 border-background flex flex-col justify-between p-1 bg-background">
                  <div className="flex justify-between">
                    <div className="size-5 bg-ember rounded-xs" />
                    <div className="size-5 bg-ember rounded-xs" />
                  </div>
                  <div className="text-[8px] font-mono text-foreground font-bold text-center">
                    OKTA-2FA
                  </div>
                  <div className="flex justify-between">
                    <div className="size-5 bg-ember rounded-xs" />
                    <div className="size-3 bg-ember rounded-xs" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Scan with Google Authenticator or Okta Verify
              </p>
            </div>

            {!twoFactorPaired ? (
              <button
                onClick={() => {
                  setTwoFactorPaired(true);
                  toast.success("2FA Device Paired Successfully!");
                }}
                className="w-full py-2 rounded-md bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-colors cursor-pointer"
              >
                Confirm 2FA Pairing
              </button>
            ) : (
              <div className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-md border border-success/20 text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                <span>2FA Device Paired & Protected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
