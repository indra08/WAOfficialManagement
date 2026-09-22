"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Globe, Key, Mail, Shield, User } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoReply, setAutoReply] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Settings</h1>
          <p className="text-sm text-muted-text">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">Full Name</label>
                <Input defaultValue="Demo User" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">Email</label>
                <Input type="email" defaultValue="demo@example.com" />
              </div>
              <Button variant="primary" size="sm">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4" />
                Password
              </CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="primary" size="sm">Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-heading">Push Notifications</p>
                  <p className="text-xs text-muted-text">Receive push notifications for new messages</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-heading">Email Notifications</p>
                  <p className="text-xs text-muted-text">Receive email summaries daily</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-heading">Auto Reply</p>
                  <p className="text-xs text-muted-text">Send automatic replies to incoming messages</p>
                </div>
                <Switch checked={autoReply} onCheckedChange={setAutoReply} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Security
              </CardTitle>
              <CardDescription>Security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">Two-Factor Authentication</label>
                <p className="text-xs text-muted-text">Add an extra layer of security to your account</p>
                <Button variant="secondary" size="sm" className="mt-2">Enable 2FA</Button>
              </div>
              <hr className="border-border" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">Session Management</label>
                <p className="text-xs text-muted-text">Active sessions: 1 on this device</p>
                <Button variant="ghost" size="sm" className="mt-2 text-error hover:bg-error-bg hover:text-error">
                  Sign out all devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
