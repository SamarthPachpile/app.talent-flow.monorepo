import React from "react";
import { StageId } from "../types/candidate";
import { Bell, X, ExternalLink } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  stageId: StageId;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onSelectStage: (stageId: StageId) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  onSelectStage,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex justify-end font-sans">
      <div className="w-full max-w-md bg-card border-l border-border h-full p-6 shadow-lifted space-y-4 animate-in slide-in-from-right duration-150 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-surface text-ember border border-border">
                <Bell className="size-4" />
              </div>
              <h3 className="text-lg font-display font-normal text-foreground">
                Notifications & Alerts
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md bg-surface hover:bg-accent/60 text-muted-foreground hover:text-foreground border border-border cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectStage(n.stageId);
                  onClose();
                }}
                className={`p-3.5 rounded-md border transition-colors cursor-pointer space-y-1 ${
                  !n.read
                    ? "bg-ember/10 border-ember/30 hover:bg-ember/15"
                    : "bg-surface border-border hover:bg-accent/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <div className="text-[10px] text-ember font-medium pt-0.5 flex items-center gap-1">
                  <span>Jump to stage details</span>
                  <ExternalLink className="size-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-surface hover:bg-accent/60 text-foreground font-medium text-xs border border-border cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
