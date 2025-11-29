"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Activity,
  Award,
  TrendingUp,
  Calendar,
  Copy,
  Edit2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useMonadWallet } from "@/lib/wallet/MonadWalletProvider";
import { useToast } from "@/lib/context/ToastContext";
import {
  getDatasetsByOwner,
  getDatasetDetails,
} from "@/lib/contract/datasetContract";
import {
  getBountiesByCreator,
  getBountiesBySubmitter,
} from "@/lib/contract/bountyContract";
import { ethers } from "ethers";

interface UserProfile {
  username: string;
  bio: string;
  avatar: string;
  memberSince: string;
  rating: number;
  transactions: number;
  verifiedDatasets: number;
  totalEarnings: string;
  badges: string[];
}

interface ActivityItem {
  id: string;
  type: "dataset" | "bounty_created" | "bounty_submitted" | "purchase";
  title: string;
  timestamp: number;
  value?: string;
  status?: string;
}

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    transactions: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showHistory: boolean;
    showEarnings: boolean;
  };
}

export default function ProfilePage() {
  const { address, isConnected, balance, provider } = useMonadWallet();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "settings"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "@dataexplorer",
    bio: "Data scientist and AI enthusiast. Building the future of decentralized data.",
    avatar: "U",
    memberSince: "November 2024",
    rating: 4.9,
    transactions: 0,
    verifiedDatasets: 0,
    totalEarnings: "0",
    badges: ["Early Adopter", "Top Contributor", "Verified Seller"],
  });

  const [editForm, setEditForm] = useState({
    username: profile.username,
    bio: profile.bio,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      transactions: true,
    },
    privacy: {
      publicProfile: true,
      showHistory: true,
      showEarnings: true,
    },
  });

  // Load blockchain stats and activity
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!address || !provider) return;

      setIsLoadingStats(true);
      setIsLoadingActivity(true);
      try {
        // Get owned datasets
        const datasetIds = await getDatasetsByOwner(provider, address);
        const datasets = await Promise.all(
          datasetIds.map((id) => getDatasetDetails(provider, id))
        );

        // Get created bounties
        const createdBountyIds = await getBountiesByCreator(provider, address);
        const createdBounties = await Promise.all(
          createdBountyIds.map(async (id) => {
            try {
              const { getBountyDetails } = await import(
                "@/lib/contract/bountyContract"
              );
              return await getBountyDetails(provider, id);
            } catch {
              return null;
            }
          })
        );

        // Get submitted bounties
        const submittedBountyIds = await getBountiesBySubmitter(
          provider,
          address
        );

        // Calculate total earnings from datasets
        const totalEarnings = datasets.reduce(
          (sum, ds) => sum + parseFloat(ds.price),
          0
        );

        // Calculate total transactions
        const totalTransactions =
          datasets.length + createdBountyIds.length + submittedBountyIds.length;

        // Update profile with real data
        setProfile((prev) => ({
          ...prev,
          verifiedDatasets: datasets.length,
          transactions: totalTransactions,
          totalEarnings: totalEarnings.toFixed(4),
        }));

        // Build activity feed
        const activityList: ActivityItem[] = [];

        // Add dataset activities
        datasets.forEach((ds) => {
          activityList.push({
            id: `dataset-${ds.id}`,
            type: "dataset",
            title: `Uploaded Dataset #${ds.id}`,
            timestamp: ds.timestamp,
            value: `${ds.price} MON`,
            status: ds.active ? "Active" : "Inactive",
          });
        });

        // Add bounty activities
        createdBounties.forEach((bounty) => {
          if (bounty) {
            activityList.push({
              id: `bounty-${bounty.id}`,
              type: "bounty_created",
              title: bounty.title,
              timestamp: bounty.timestamp,
              value: `${ethers.formatEther(bounty.reward)} MON`,
              status:
                bounty.status === 0
                  ? "Active"
                  : bounty.status === 1
                  ? "Fulfilled"
                  : "Cancelled",
            });
          }
        });

        // Sort by timestamp (newest first)
        activityList.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(activityList);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      } finally {
        setIsLoadingStats(false);
        setIsLoadingActivity(false);
      }
    };

    if (address && provider && isConnected) {
      loadBlockchainData();
    }
  }, [address, provider, isConnected]);

  // Load saved profile from localStorage
  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`montify_profile_${address}`);
      if (saved) {
        const data = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          username: data.username,
          bio: data.bio,
        }));
        setEditForm({
          username: data.username || "@dataexplorer",
          bio:
            data.bio ||
            "Data scientist and AI enthusiast. Building the future of decentralized data.",
        });
      }

      // Load saved settings
      const savedSettings = localStorage.getItem(`montify_settings_${address}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [address]);

  const handleSettingChange = (
    category: "notifications" | "privacy",
    key: string,
    value: boolean
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(newSettings);

    // Save to localStorage
    if (address) {
      localStorage.setItem(
        `montify_settings_${address}`,
        JSON.stringify(newSettings)
      );
      showToast("Settings updated", "success");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "dataset":
        return "📊";
      case "bounty_created":
        return "💎";
      case "bounty_submitted":
        return "✅";
      case "purchase":
        return "🛒";
      default:
        return "📝";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-500/20 border-green-400/30";
      case "fulfilled":
        return "text-blue-400 bg-blue-500/20 border-blue-400/30";
      case "cancelled":
      case "inactive":
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
      default:
        return "text-purple-400 bg-purple-500/20 border-purple-400/30";
    }
  };

  const handleSaveProfile = () => {
    if (address) {
      const updated = { ...profile, ...editForm };
      setProfile(updated);
      localStorage.setItem(
        `montify_profile_${address}`,
        JSON.stringify(updated)
      );
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      showToast("Address copied to clipboard!", "success");
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-24">
          <div className="text-center max-w-2xl mx-auto">
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-glow-purple">
              <User className="w-10 h-10 text-white" />
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Connect Your Wallet
            </h1>

            <p className="text-xl text-foreground-secondary mb-8 leading-relaxed">
              Connect your wallet to unlock your personalized Montify profile
              and start managing your datasets and bounties
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: "🔒",
                  title: "Secure",
                  desc: "Protected by blockchain",
                },
                { icon: "⚡", title: "Fast", desc: "Instant transactions" },
                { icon: "💰", title: "Earn", desc: "Monetize your data" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-foreground-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground-tertiary">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-foreground-tertiary">
              Don&apos;t have a wallet?{" "}
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Get MetaMask →
              </a>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-base pt-24 pb-20">
      <div className="container-center">
        {/* Profile Header */}
        <div className="mb-16 text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-glow-purple transition-transform hover:scale-105 duration-300">
            <User className="w-12 h-12 text-white" />
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground-primary mb-5 tracking-tight">
            User Profile
          </h1>

          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            Manage your profile, reputation, and public presence in the Montify
            community
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8 mb-10 transition-all duration-300 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white text-5xl font-bold shadow-glow-purple transition-transform duration-300 group-hover:scale-105">
                {profile.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 border-4 border-background-elevated flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-background-base border border-purple-500/30 rounded-xl text-foreground-primary font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="@username"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-background-base border border-purple-500/30 rounded-xl text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveProfile}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 hover:shadow-glow-purple transition-all duration-300 flex items-center gap-2 hover:scale-105"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-3 bg-background-base border border-purple-500/30 text-foreground-primary rounded-xl font-semibold hover:bg-background-elevated hover:border-purple-400/50 transition-all duration-300 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-display text-3xl font-bold text-foreground-primary">
                      {profile.username}
                    </h2>
                    {profile.badges.slice(0, 1).map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-semibold text-purple-400"
                      >
                        ✨ {badge}
                      </span>
                    ))}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="ml-auto p-2 hover:bg-background-base rounded-xl transition-all duration-300 group hover:scale-110"
                      title="Edit profile"
                    >
                      <Edit2 className="w-5 h-5 text-foreground-tertiary group-hover:text-purple-400 transition-colors duration-300" />
                    </button>
                  </div>
                  <p className="text-foreground-secondary mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-foreground-tertiary">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.memberSince}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-foreground-tertiary">
                        {formatAddress(address!)}
                      </span>
                      <button
                        onClick={copyAddress}
                        className="p-1 hover:bg-background-base rounded transition-colors"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4 text-foreground-tertiary hover:text-purple-400" />
                      </button>
                    </div>
                    <div className="px-4 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-full">
                      <span className="text-purple-400 font-bold">
                        {balance ? parseFloat(balance).toFixed(4) : "0.0000"}{" "}
                        MON
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20 transition-transform duration-300 hover:scale-110">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-foreground-secondary text-sm font-medium">
                Reputation
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground-primary mb-2">
              {profile.rating}
              <span className="text-lg text-foreground-tertiary">/5.0</span>
            </div>
            <p className="text-xs text-foreground-tertiary">Community rating</p>
          </div>

          <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20 transition-transform duration-300 hover:scale-110">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-foreground-secondary text-sm font-medium">
                Datasets
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground-primary mb-2">
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              ) : (
                profile.verifiedDatasets
              )}
            </div>
            <p className="text-xs text-foreground-tertiary">
              On-chain verified
            </p>
          </div>

          <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20 transition-transform duration-300 hover:scale-110">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-foreground-secondary text-sm font-medium">
                Transactions
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground-primary mb-2">
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              ) : (
                profile.transactions
              )}
            </div>
            <p className="text-xs text-foreground-tertiary">Total activity</p>
          </div>

          <div className="p-6 bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20 transition-transform duration-300 hover:scale-110">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-foreground-secondary text-sm font-medium">
                Total Earned
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground-primary mb-2">
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              ) : (
                <>
                  {profile.totalEarnings}{" "}
                  <span className="text-lg text-foreground-tertiary">MON</span>
                </>
              )}
            </div>
            <p className="text-xs text-foreground-tertiary">From datasets</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {(["overview", "activity", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-glow-purple scale-105"
                  : "bg-background-elevated/60 text-foreground-secondary hover:bg-background-elevated border border-purple-500/30 hover:border-purple-400/50 hover:scale-105"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Achievements */}
              <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-foreground-primary mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge}
                      className="p-4 bg-background-base/50 rounded-xl border border-purple-500/20 flex items-center gap-4 transition-all duration-300 hover:border-purple-400/50 hover:bg-background-base/70 hover:scale-105 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-2xl transition-transform duration-300 hover:rotate-12">
                        🌟
                      </div>
                      <div>
                        <div className="font-semibold text-foreground-primary mb-1">
                          {badge}
                        </div>
                        <div className="text-xs text-foreground-tertiary">
                          Earned {profile.memberSince}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-foreground-primary mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Upload Dataset",
                      href: "/upload",
                      icon: "📤",
                      desc: "Share your data with the community",
                    },
                    {
                      label: "Create Bounty",
                      href: "/bounties",
                      icon: "💎",
                      desc: "Request specific datasets",
                    },
                    {
                      label: "Browse Marketplace",
                      href: "/marketplace",
                      icon: "🛍️",
                      desc: "Discover quality datasets",
                    },
                    {
                      label: "View Dashboard",
                      href: "/dashboard",
                      icon: "📊",
                      desc: "Analytics and insights",
                    },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}>
                      <div className="p-5 bg-background-base/50 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group cursor-pointer hover:bg-background-base/70 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl transition-transform duration-300 group-hover:scale-125">
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground-primary group-hover:text-purple-400 transition-colors duration-300 mb-1">
                              {action.label}
                            </div>
                            <div className="text-xs text-foreground-tertiary">
                              {action.desc}
                            </div>
                          </div>
                          <TrendingUp className="w-5 h-5 text-foreground-tertiary group-hover:text-purple-400 transition-all duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground-primary mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>

              {isLoadingActivity ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-5 bg-background-base/50 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:bg-background-base/70 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-foreground-primary truncate">
                              {activity.title}
                            </h4>
                            {activity.status && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                                  activity.status
                                )}`}
                              >
                                {activity.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-foreground-tertiary">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(activity.timestamp)}
                            </span>
                            {activity.value && (
                              <span className="font-semibold text-purple-400">
                                {activity.value}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-foreground-tertiary mt-1 capitalize">
                            {activity.type.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-purple-400" />
                  </div>
                  <p className="text-foreground-secondary mb-4">
                    Your activity will appear here
                  </p>
                  <p className="text-sm text-foreground-tertiary mb-6">
                    Start by uploading a dataset or creating a bounty
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/upload">
                      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-violet-500 transition-all">
                        Upload Dataset
                      </button>
                    </Link>
                    <Link href="/bounties">
                      <button className="px-6 py-2 bg-background-base border border-purple-500/30 text-foreground-primary rounded-xl font-semibold hover:bg-background-elevated transition-all">
                        Create Bounty
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground-primary mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Profile Settings
              </h3>
              <div className="space-y-8">
                {/* Notification Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground-primary mb-1">
                    Notifications
                  </h4>
                  <p className="text-sm text-foreground-tertiary mb-4">
                    Manage how you receive updates about your activity
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-background-base/50 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          📧
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Email Notifications
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Receive updates via email
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "email",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-background-base/50 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          🔔
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Push Notifications
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Browser push notifications
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "push",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-background-base/50 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          💸
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Transaction Alerts
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Notify on purchases and earnings
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.transactions}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "transactions",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground-primary mb-1">
                    Privacy & Visibility
                  </h4>
                  <p className="text-sm text-foreground-tertiary mb-4">
                    Control what information is visible to others
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-background-base/50 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          👤
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Public Profile
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Make your profile visible to everyone
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.publicProfile}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "publicProfile",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-background-base/50 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          📊
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Show Transaction History
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Display your activity timeline
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showHistory}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "showHistory",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-background-base/50 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          💰
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Display Earnings
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Show your total earnings publicly
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showEarnings}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "showEarnings",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </label>
                  </div>
                </div>

                {/* Account Actions */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground-primary mb-1">
                    Account Actions
                  </h4>
                  <p className="text-sm text-foreground-tertiary mb-4">
                    Manage your account data
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (address) {
                          const data = {
                            profile,
                            settings,
                            address,
                            exportDate: new Date().toISOString(),
                          };
                          const blob = new Blob(
                            [JSON.stringify(data, null, 2)],
                            { type: "application/json" }
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `montify-profile-${address.slice(
                            0,
                            8
                          )}.json`;
                          a.click();
                          showToast("Profile data exported", "success");
                        }
                      }}
                      className="w-full p-4 bg-background-base/50 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          📥
                        </div>
                        <div>
                          <div className="font-semibold text-foreground-primary">
                            Export Profile Data
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Download your profile information
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          address &&
                          confirm(
                            "Are you sure you want to clear all local data? This will not affect blockchain data."
                          )
                        ) {
                          localStorage.removeItem(`montify_profile_${address}`);
                          localStorage.removeItem(
                            `montify_settings_${address}`
                          );
                          showToast("Local data cleared", "success");
                          window.location.reload();
                        }
                      }}
                      className="w-full p-4 bg-background-base/50 rounded-xl border border-red-500/20 hover:border-red-400/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          🗑️
                        </div>
                        <div>
                          <div className="font-semibold text-red-400">
                            Clear Local Data
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Remove profile data from this browser
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
