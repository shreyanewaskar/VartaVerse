import { useState } from "react";
import { Bell, Lock, Palette, Eye, LogOut, ChevronRight } from "lucide-react";

type SettingsTab = "account" | "privacy" | "notifications" | "theme";

interface SettingItem {
  label: string;
  description: string;
  type: "toggle" | "select";
  value?: boolean | string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    profilePublic: true,
    showActivity: true,
    dataCollection: true,
    theme: "light",
    fontSize: "medium",
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-media-dark-raspberry mb-2">
            Settings
          </h1>
          <p className="text-media-dark-raspberry/70">
            Manage your preferences and account
          </p>
        </div>

        {/* Content */}
        <div className="flex gap-6 animate-slide-up">
          {/* Sidebar */}
          <aside className="w-48 hidden md:flex flex-col gap-2">
            {(
              [
                {
                  id: "account",
                  label: "Account",
                  icon: Lock,
                },
                {
                  id: "privacy",
                  label: "Privacy & Safety",
                  icon: Eye,
                },
                {
                  id: "notifications",
                  label: "Notifications",
                  icon: Bell,
                },
                {
                  id: "theme",
                  label: "Appearance",
                  icon: Palette,
                },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium smooth-all ${
                    activeTab === item.id
                      ? "bg-media-berry-crush text-white shadow-lg"
                      : "text-media-dark-raspberry hover:bg-media-pearl-aqua/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </aside>

          {/* Main Settings */}
          <div className="flex-1 space-y-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h2 className="text-xl font-bold text-media-dark-raspberry mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Email */}
                    <div className="pb-6 border-b border-media-frozen-water">
                      <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="alex.chen@example.com"
                        className="w-full px-4 py-2 rounded-lg border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none smooth-all"
                      />
                    </div>

                    {/* Username */}
                    <div className="pb-6 border-b border-media-frozen-water">
                      <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue="alexchen"
                        className="w-full px-4 py-2 rounded-lg border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none smooth-all"
                      />
                    </div>

                    {/* Password */}
                    <div className="pb-6 border-b border-media-frozen-water">
                      <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                        Password
                      </label>
                      <button className="text-media-pearl-aqua font-medium hover:text-media-berry-crush smooth-all">
                        Change Password
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t-2 border-red-200">
                      <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 smooth-all">
                        <LogOut className="w-5 h-5" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
                <h2 className="text-xl font-bold text-media-dark-raspberry">
                  Privacy & Safety
                </h2>

                {/* Profile Visibility */}
                <div className="flex items-center justify-between pb-4 border-b border-media-frozen-water">
                  <div>
                    <p className="font-semibold text-media-dark-raspberry">
                      Public Profile
                    </p>
                    <p className="text-sm text-media-dark-raspberry/60">
                      Allow others to see your profile and reviews
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting("profilePublic")}
                    className={`relative inline-flex h-8 w-14 rounded-full smooth-all ${
                      settings.profilePublic
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush"
                        : "bg-media-frozen-water"
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5 ${
                        settings.profilePublic ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Activity Status */}
                <div className="flex items-center justify-between pb-4 border-b border-media-frozen-water">
                  <div>
                    <p className="font-semibold text-media-dark-raspberry">
                      Show Activity Status
                    </p>
                    <p className="text-sm text-media-dark-raspberry/60">
                      Let others see when you're online
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting("showActivity")}
                    className={`relative inline-flex h-8 w-14 rounded-full smooth-all ${
                      settings.showActivity
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush"
                        : "bg-media-frozen-water"
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5 ${
                        settings.showActivity ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Data Collection */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-media-dark-raspberry">
                      Data Collection
                    </p>
                    <p className="text-sm text-media-dark-raspberry/60">
                      Help improve VartaVerse by sharing usage data
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting("dataCollection")}
                    className={`relative inline-flex h-8 w-14 rounded-full smooth-all ${
                      settings.dataCollection
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush"
                        : "bg-media-frozen-water"
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5 ${
                        settings.dataCollection ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
                <h2 className="text-xl font-bold text-media-dark-raspberry">
                  Notifications
                </h2>

                {/* Email Notifications */}
                <div className="flex items-center justify-between pb-4 border-b border-media-frozen-water">
                  <div>
                    <p className="font-semibold text-media-dark-raspberry">
                      Email Notifications
                    </p>
                    <p className="text-sm text-media-dark-raspberry/60">
                      Receive updates via email
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting("emailNotifications")}
                    className={`relative inline-flex h-8 w-14 rounded-full smooth-all ${
                      settings.emailNotifications
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush"
                        : "bg-media-frozen-water"
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5 ${
                        settings.emailNotifications ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between pb-4 border-b border-media-frozen-water">
                  <div>
                    <p className="font-semibold text-media-dark-raspberry">
                      Push Notifications
                    </p>
                    <p className="text-sm text-media-dark-raspberry/60">
                      Receive browser notifications
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting("pushNotifications")}
                    className={`relative inline-flex h-8 w-14 rounded-full smooth-all ${
                      settings.pushNotifications
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush"
                        : "bg-media-frozen-water"
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5 ${
                        settings.pushNotifications ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-media-dark-raspberry">
                      Marketing Emails
                    </p>
                    <p className="text-sm text-media-dark-raspberry/60">
                      Promotional updates and new features
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting("marketingEmails")}
                    className={`relative inline-flex h-8 w-14 rounded-full smooth-all ${
                      settings.marketingEmails
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush"
                        : "bg-media-frozen-water"
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5 ${
                        settings.marketingEmails ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === "theme" && (
              <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
                <h2 className="text-xl font-bold text-media-dark-raspberry">
                  Appearance
                </h2>

                {/* Theme */}
                <div className="pb-6 border-b border-media-frozen-water">
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-3">
                    Theme
                  </label>
                  <div className="flex gap-3">
                    {["light", "dark", "auto"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSetting("theme", theme)}
                        className={`px-6 py-3 rounded-lg font-medium capitalize smooth-all ${
                          settings.theme === theme
                            ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush text-white"
                            : "bg-media-frozen-water text-media-dark-raspberry hover:bg-media-pearl-aqua/30"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-3">
                    Font Size
                  </label>
                  <div className="flex gap-3">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting("fontSize", size)}
                        className={`px-6 py-3 rounded-lg font-medium capitalize smooth-all ${
                          settings.fontSize === size
                            ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush text-white"
                            : "bg-media-frozen-water text-media-dark-raspberry hover:bg-media-pearl-aqua/30"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white font-bold hover:shadow-lg smooth-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
