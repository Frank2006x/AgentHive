import Link from "next/link";
import {
  BookOpen,
  Zap,
  Code,
  Brain,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8 flex items-center justify-center gap-4 animate-fade-in">
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-transform duration-300">
              <Brain className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
              Forcio AI
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-3xl text-slate-200 mb-4 font-semibold tracking-tight">
            Master LeetCode with AI-Powered Intelligence
          </p>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your coding interview preparation with personalized AI
            tutoring, instant solutions, and adaptive learning strategies that
            evolve with you.
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mb-12 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-400">AI-Powered Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-slate-400">Adaptive Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-slate-400">Instant Feedback</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-20 flex-wrap">
            <Link href="/home">
              <button className="group relative px-10 py-5 text-lg font-semibold rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <span className="flex items-center gap-2">
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-blue-500/70 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">
                  Study Mode
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Interactive AI tutoring that adapts to your understanding. Get
                  hints, explanations, and step-by-step guidance as you learn.
                </p>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-yellow-500/70 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">
                  Power Mode
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Instant solution generation with multiple strategies,
                  complexity analysis, and production-ready optimized code.
                </p>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-purple-500/70 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">
                  Smart Analysis
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Deep problem analysis with pattern recognition, strategic
                  insights, and personalized learning paths.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                AI-Powered
              </div>
              <p className="text-slate-400">Advanced Language Models</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                2 Modes
              </div>
              <p className="text-slate-400">Learn or Generate Instantly</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-slate-400">Always Available AI Tutor</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center relative z-10 border-t border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-slate-300">Forcio AI</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            © 2026 Forcio AI. Empowering developers worldwide with AI-driven
            learning.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <Link
              href="/home"
              className="hover:text-purple-400 transition-colors"
            >
              Get Started
            </Link>
            <span>•</span>
            <Link
              href="/study"
              className="hover:text-purple-400 transition-colors"
            >
              Study Mode
            </Link>
            <span>•</span>
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              LeetCode
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
