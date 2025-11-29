"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Play,
  ChevronDown,
  Database,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../Button";
import { StatCard } from "../StatCard";
import { fadeInUp, staggerContainer, wordReveal } from "@/lib/motionVariants";

const HeroParticles = dynamic(
  () => import("./HeroParticles").then((mod) => mod.HeroParticles),
  { ssr: false }
);

export function Hero() {
  const router = useRouter();
  const words = "Trade Datasets with Provable Quality".split(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Particles */}
      <HeroParticles />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeInUp} className="inline-block">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-purple-400 block">
              POWERED BY MONAD BLOCKCHAIN
            </span>
          </motion.div>

          {/* Main Headline with word reveal */}
          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] max-w-5xl mx-auto"
            variants={staggerContainer}
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={wordReveal}
                className="inline-block mr-4 md:mr-5"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="font-body text-lg md:text-xl text-[var(--color-fg-secondary)] max-w-3xl mx-auto leading-[1.7] px-4"
          >
            AI-verified, blockchain-certified dataset marketplace on Monad.
            Trade datasets with provable quality and lightning-fast
            transactions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6"
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => router.push("/upload")}
              ariaLabel="Get started by uploading a dataset"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Play className="w-5 h-5" />}
              iconPosition="left"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto pt-20 md:pt-24"
          >
            <StatCard
              icon={Database}
              value="1,247+"
              label="Verified Datasets"
              accent="pink"
            />
            <StatCard
              icon={TrendingUp}
              value="$2.3M+"
              label="Total Value Traded"
              accent="magenta"
            />
            <StatCard
              icon={Sparkles}
              value="98.7%"
              label="AI Accuracy"
              accent="teal"
            />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-[var(--color-fg-tertiary)] hover:text-white transition-colors cursor-pointer" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
