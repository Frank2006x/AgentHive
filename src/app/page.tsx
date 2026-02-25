import Link from "next/link";
import { BookOpen, Zap, Code, Brain } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Forcio AI
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl text-slate-300 mb-4 font-light">
            Your AI-Powered LeetCode Learning Companion
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Master algorithm problems with personalized tutoring and automated
            solution generation. Choose your learning style and let AI guide
            your journey.
          </p>

          {/* CTA Button */}
          <Link href="/home">
            <button className="group relative px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-2xl shadow-purple-500/40 hover:shadow-purple-400/50 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-2">
                Get Started
                <Code className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>

          {/* Features Grid */}
          <div className="mt-20 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100">
                  Study Mode
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Interactive chat-based tutoring that adapts to your
                understanding level. Ask questions, get hints, and learn at your
                own pace.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100">
                  Power Mode
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Instant solution generation with strategy comparison, complexity
                analysis, and optimized code ready to submit.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>
          © 2026 Forcio AI. Powered by AI to accelerate your coding journey.
        </p>
      </footer>
    </div>
  );
}
