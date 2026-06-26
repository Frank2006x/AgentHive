"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  ChevronDown,
  Code2,
  Terminal,
  Github,
  TrendingUp
} from "lucide-react";
import { Toaster } from "sonner";

export default function LandingPage() {
  const [previewMode, setPreviewMode] = useState<"study" | "power">("study");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/35 antialiased overflow-x-hidden">
      <Toaster position="top-right" richColors theme="dark" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group transition-opacity hover:opacity-90">
            <Image src="/logo.png" alt="Forcio AI" width={360} height={96} className="h-16 w-auto object-contain" priority />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 cursor-pointer"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link href="/home">
              <button className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-medium transition-all shadow-sm shadow-primary/10 flex items-center gap-1.5 cursor-pointer">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-12 md:pt-16 pb-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center items-center text-center z-10">
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-wide animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Beta is Now Live</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-foreground font-sans leading-[1.1] animate-fade-in">
            Master LeetCode <br className="hidden sm:inline" />
            without getting stuck.
          </h1>

          {/* Supporting Text */}
          <p className="text-md md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed animate-fade-in delay-200">
            Adaptive hints, step-by-step explanations, optimized solutions, and interview-ready guidance.
          </p>

          {/* CTA Button Group */}
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap animate-fade-in delay-300">
            <Link href="/home">
              <button className="h-12 px-6 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-medium transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer">
                Start Free
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </Link>
            <button
              onClick={() => scrollToSection("preview")}
              className="h-12 px-6 rounded-lg border border-border bg-input/10 hover:bg-input/20 text-foreground font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* PRODUCT PREVIEW CONTAINER (Dominated Hero) */}
        <div id="preview" className="w-full max-w-6xl mx-auto px-6 mt-12 md:mt-16 z-20">
          <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden transition-all duration-500 hover:border-primary/30">
            
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/80">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              
              <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-[11px] text-muted-foreground font-mono">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>forcio-ai-ide — two_sum.py</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode("study")}
                  className={`px-2.5 py-0.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                    previewMode === "study"
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Study Mode
                </button>
                <button
                  onClick={() => setPreviewMode("power")}
                  className={`px-2.5 py-0.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                    previewMode === "power"
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Power Mode
                </button>
              </div>
            </div>

            {/* IDE Workspace */}
            <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border h-[460px] text-sm overflow-hidden bg-background/40">
              
              {/* LEFT SIDE: Code Editor (60% width) */}
              <div className="md:col-span-7 flex flex-col min-h-0 bg-background/60">
                {/* Editor Tabs */}
                <div className="flex items-center border-b border-border/80 bg-muted/10 px-4 h-9">
                  <div className="flex items-center gap-1.5 text-xs font-mono border-r border-border h-full px-3 text-foreground bg-background/80 border-t border-t-primary">
                    <Code2 className="w-3.5 h-3.5 text-yellow-500" />
                    <span>two_sum.py</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono h-full px-3 text-muted-foreground/60">
                    <span>problem_statement.md</span>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed text-foreground select-none">
                  {previewMode === "study" ? (
                    <div className="space-y-1 text-slate-300">
                      <div><span className="text-purple-400 font-semibold">def</span> <span className="text-blue-400">twoSum</span>(nums: list[<span className="text-green-400">int</span>], target: <span className="text-green-400">int</span>) -&gt; list[<span className="text-green-400">int</span>]:</div>
                      <div className="text-muted-foreground/60">&nbsp;&nbsp;&nbsp;&nbsp;# Brute force approach: O(n^2) time</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">for</span> i <span className="text-purple-400 font-semibold">in</span> <span className="text-blue-400">range</span>(<span className="text-blue-400">len</span>(nums)):</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">for</span> j <span className="text-purple-400 font-semibold">in</span> <span className="text-blue-400">range</span>(i + <span className="text-amber-400">1</span>, <span className="text-blue-400">len</span>(nums)):</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">if</span> nums[i] + nums[j] == target:</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">return</span> [i, j]</div>
                      <div className="h-6" />
                      <div className="animate-pulse flex items-center text-primary/70 font-mono text-[11px]">&nbsp;&nbsp;&nbsp;&nbsp;| Start typing details or asking tutor...</div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-300">
                      <div><span className="text-purple-400 font-semibold">def</span> <span className="text-blue-400">twoSum</span>(nums: list[<span className="text-green-400">int</span>], target: <span className="text-green-400">int</span>) -&gt; list[<span className="text-green-400">int</span>]:</div>
                      <div className="text-muted-foreground/60">&nbsp;&nbsp;&nbsp;&nbsp;# Optimized Hash Map approach: O(n) time, O(n) space</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;seen = &#123;&#125;</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">for</span> idx, num <span className="text-purple-400 font-semibold">in</span> <span className="text-blue-400">enumerate</span>(nums):</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complement = target - num</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">if</span> complement <span className="text-purple-400 font-semibold">in</span> seen:</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400 font-semibold">return</span> [seen[complement], idx]</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seen[num] = idx</div>
                    </div>
                  )}
                </div>

                {/* Bottom Action / Comparison Bar */}
                <div className="p-3 border-t border-border/80 bg-muted/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground font-mono">Complexity:</span>
                    {previewMode === "study" ? (
                      <span className="px-2 py-0.5 text-xs rounded bg-destructive/10 text-destructive border border-destructive/20 font-mono">Time: O(N²)</span>
                    ) : (
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 text-xs rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono">Time: O(N)</span>
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">Space: O(N)</span>
                      </div>
                    )}
                  </div>
                  
                  {previewMode === "study" && (
                    <button
                      onClick={() => setPreviewMode("power")}
                      className="px-3.5 py-1.5 text-xs rounded bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Optimize Solution
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: AI Tutor Panel (40% width) */}
              <div className="md:col-span-5 flex flex-col min-h-0 bg-card">
                {/* Tutor Header */}
                <div className="flex items-center justify-between border-b border-border/80 px-4 h-9 bg-muted/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-foreground font-medium">LeetCode Tutor</span>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                    {previewMode === "study" ? "STUDY MODE" : "POWER MODE"}
                  </span>
                </div>

                {/* Message / Info Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
                  {previewMode === "study" ? (
                    <>
                      {/* Message 1 */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-muted-foreground font-mono">USER • 2 mins ago</div>
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-foreground">
                          How can I improve the O(N²) solution? The nested loops take too much runtime.
                        </div>
                      </div>

                      {/* Message 2 */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-primary font-mono">TUTOR • Just now</div>
                        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground leading-relaxed">
                          Great goal! Notice that in the inner loop, we search for `target - nums[i]` (the complement).
                          <br /><br />
                          Is there a data structure that lets us check if we&apos;ve seen the complement before in O(1) constant time?
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {/* Strategy Selection */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Select Strategy</div>
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-foreground">One-Pass Hash Map</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">Store index map while traversing</div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-bold">O(N)</div>
                              <div className="text-[9px] text-muted-foreground font-mono">Time & Space</div>
                            </div>
                          </div>
                          
                          <div className="p-2.5 rounded-lg border border-border/60 bg-muted/15 flex items-center justify-between opacity-60">
                            <div>
                              <div className="font-semibold text-foreground">Sort + Two Pointers</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">Sort array, slide pointers</div>
                            </div>
                            <div className="text-right">
                              <div className="text-yellow-500 font-bold">O(N log N)</div>
                              <div className="text-[9px] text-muted-foreground font-mono">Time complexity</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Runtime Graph */}
                      <div className="space-y-1 border-t border-border/60 pt-3">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center justify-between">
                          <span>Performance Stats</span>
                          <span className="text-green-400">Beats 98.2%</span>
                        </div>
                        <div className="bg-muted/30 border border-border/40 p-2.5 rounded-lg space-y-1.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span>Runtime: 35ms</span>
                            <span className="text-green-400 font-semibold">Fastest</span>
                          </div>
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: "98%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input box */}
                <div className="p-3 border-t border-border/80 bg-muted/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={previewMode === "study" ? "Ask the tutor for a hint..." : "Review solution insights..."}
                      disabled
                      className="flex-1 px-3 py-1.5 rounded bg-background border border-border text-xs text-muted-foreground focus:outline-none"
                    />
                    <button className="px-3 py-1.5 rounded bg-muted text-muted-foreground text-xs font-mono select-none pointer-events-none">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => scrollToSection("workflow")}
          className="w-full flex flex-col items-center justify-end h-20 text-muted-foreground hover:text-foreground transition-colors cursor-pointer mt-12"
        >
          <span className="text-[10px] tracking-widest uppercase font-mono opacity-60">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 mt-1 animate-bounce" />
        </div>
      </section>

      {/* SECTION 2: WORKFLOW (100–200vh) */}
      <section id="workflow" className="py-24 border-t border-border bg-background relative overflow-hidden">
        
        {/* Sub Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-sans">
            From confusion to confidence.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Stop grinding aimlessly. Forcio AI leads you through the exact cognitive workflow used by senior engineers to solve complex coding interviews.
          </p>
        </div>

        {/* Clean Vertical Stepper Journey */}
        <div className="max-w-2xl mx-auto px-6 relative">
          
          {/* Vertical Track Line */}
          <div className="absolute left-9 md:left-1/2 top-0 bottom-0 w-px bg-border/60 transform md:-translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-12 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 relative">
              <div className="w-full md:w-[45%] text-left md:text-right order-2 md:order-1">
                <h3 className="text-base font-bold text-foreground">Choose a problem</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Input any LeetCode slug. Forcio AI synchronizes problem statements, categories, difficulty levels, and constraints.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-background border border-border text-xs font-mono font-bold flex items-center justify-center text-primary shrink-0 relative z-10 order-1 md:order-2 md:mx-auto shadow-sm">
                01
              </div>
              <div className="hidden md:block w-[45%] order-3" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 relative">
              <div className="hidden md:block w-[45%] text-right order-1" />
              <div className="w-8 h-8 rounded-full bg-background border border-border text-xs font-mono font-bold flex items-center justify-center text-primary shrink-0 relative z-10 order-1 md:order-2 md:mx-auto shadow-sm">
                02
              </div>
              <div className="w-full md:w-[45%] text-left order-2 md:order-3">
                <h3 className="text-base font-bold text-foreground">Ask Forcio</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Query the tutor directly regarding syntax errors, brute-force ideas, dynamic programming recurrence relations, or logical gaps.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 relative">
              <div className="w-full md:w-[45%] text-left md:text-right order-2 md:order-1">
                <h3 className="text-base font-bold text-foreground">Receive adaptive hints</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Rather than feeding you raw code, the AI models deliver incremental, conceptual hints that trigger critical problem-solving skills.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-background border border-border text-xs font-mono font-bold flex items-center justify-center text-primary shrink-0 relative z-10 order-1 md:order-2 md:mx-auto shadow-sm">
                03
              </div>
              <div className="hidden md:block w-[45%] order-3" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 relative">
              <div className="hidden md:block w-[45%] text-right order-1" />
              <div className="w-8 h-8 rounded-full bg-background border border-border text-xs font-mono font-bold flex items-center justify-center text-primary shrink-0 relative z-10 order-1 md:order-2 md:mx-auto shadow-sm">
                04
              </div>
              <div className="w-full md:w-[45%] text-left order-2 md:order-3">
                <h3 className="text-base font-bold text-foreground">Understand the concept</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Gain deep conceptual retention. Master standard interview data structures, algorithms, and logic trees rather than rote copying.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 relative">
              <div className="w-full md:w-[45%] text-left md:text-right order-2 md:order-1">
                <h3 className="text-base font-bold text-foreground">Optimize your solution</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Review trade-offs across runtime metrics, memory allocation bounds, and alternative sorting/hashing algorithms.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-background border border-border text-xs font-mono font-bold flex items-center justify-center text-primary shrink-0 relative z-10 order-1 md:order-2 md:mx-auto shadow-sm">
                05
              </div>
              <div className="hidden md:block w-[45%] order-3" />
            </div>

            {/* Step 6 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 relative">
              <div className="hidden md:block w-[45%] text-right order-1" />
              <div className="w-8 h-8 rounded-full bg-background border border-border text-xs font-mono font-bold flex items-center justify-center text-primary shrink-0 relative z-10 order-1 md:order-2 md:mx-auto shadow-sm">
                06
              </div>
              <div className="w-full md:w-[45%] text-left order-2 md:order-3">
                <h3 className="text-base font-bold text-foreground">Submit with confidence</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Verify edge cases, validate bounds constraints, compare solution complexity, and crush your technical interviews.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2.5: LEARNING MODES SCREENSHOT MOCKUPS */}
      <section id="modes" className="py-24 border-t border-border bg-muted/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-sans">
              Tailored modes for different challenges.
            </h2>
            <p className="text-sm text-muted-foreground mt-3 font-sans">
              Switch seamlessly between guided conceptual tutoring and instant high-performance complexity optimization.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* STUDY MODE PANEL */}
            <div className="flex flex-col border border-border bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Tab Header */}
              <div className="px-4 py-3 bg-muted/20 border-b border-border/80 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono font-bold text-foreground">Study Mode Interface</span>
              </div>
              {/* Content Panel Mockup */}
              <div className="p-6 flex-1 flex flex-col bg-background/30 justify-between h-[380px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary font-mono rounded">GUIDED HINTS</span>
                    <span className="text-xs text-muted-foreground">Interactive concept tracking</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
                      <div className="font-semibold text-foreground mb-1">Tutor Concept Explanation:</div>
                      <span className="text-muted-foreground">
                        Before optimizing code syntax, let&apos;s map out the problem visually. We maintain two index pointers `left` and `right`.
                        If our current sum is larger than the target, we slide the `right` pointer leftwards to reduce the sum.
                      </span>
                    </div>

                    <div className="border border-border/40 p-3 rounded-lg bg-background/50 space-y-2">
                      <div className="text-[10px] text-muted-foreground">Visual Trace: Array [2, 7, 11, 15], Target 9</div>
                      <div className="flex gap-1.5 font-mono text-[11px]">
                        <span className="px-1.5 py-0.5 bg-primary/20 border border-primary/30 rounded text-primary">L: 2 (idx 0)</span>
                        <span className="px-1.5 py-0.5 bg-muted rounded">11 (idx 2)</span>
                        <span className="px-1.5 py-0.5 bg-primary/20 border border-primary/30 rounded text-primary">R: 7 (idx 1)</span>
                      </div>
                      <div className="text-[10px] text-green-400 font-semibold mt-1">Sum matching: 2 + 7 == 9. Pair found.</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>✓ Conceptual Tutoring</span>
                  <span>✓ Step-by-Step Tracing</span>
                </div>
              </div>
            </div>

            {/* POWER MODE PANEL */}
            <div className="flex flex-col border border-border bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Tab Header */}
              <div className="px-4 py-3 bg-muted/20 border-b border-border/80 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                <span className="text-xs font-mono font-bold text-foreground">Power Mode Interface</span>
              </div>
              {/* Content Panel Mockup */}
              <div className="p-6 flex-1 flex flex-col bg-background/30 justify-between h-[380px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] bg-yellow-500/10 text-yellow-500 font-mono rounded">OPTIMIZED GENERATION</span>
                    <span className="text-xs text-muted-foreground">Complexity & Memory Analysis</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {/* Complexity Table */}
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-3 bg-muted/40 p-2 text-[10px] text-muted-foreground border-b border-border/50 font-semibold">
                        <span>Strategy</span>
                        <span>Time</span>
                        <span>Space</span>
                      </div>
                      <div className="divide-y divide-border/30">
                        <div className="grid grid-cols-3 p-2 bg-background/40">
                          <span className="text-foreground font-medium">Hash Map (1-Pass)</span>
                          <span className="text-green-400">O(N)</span>
                          <span className="text-yellow-500">O(N)</span>
                        </div>
                        <div className="grid grid-cols-3 p-2 bg-background/20">
                          <span>Sorting + Pointers</span>
                          <span className="text-yellow-500">O(N log N)</span>
                          <span className="text-green-400">O(1)</span>
                        </div>
                        <div className="grid grid-cols-3 p-2 bg-background/10">
                          <span>Brute Force Array</span>
                          <span className="text-red-500">O(N²)</span>
                          <span className="text-green-400">O(1)</span>
                        </div>
                      </div>
                    </div>

                    {/* Runtime comparison */}
                    <div className="bg-muted/20 border border-border/40 p-3 rounded-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-[10px] text-muted-foreground">Memory Analysis</div>
                        <div className="text-xs text-foreground font-semibold">14.1 MB vs 28.4 MB average</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded">
                        <TrendingUp className="w-3.5 h-3.5" />
                        50.3% Optimized
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>✓ Multiple Approaches</span>
                  <span>✓ Complexity Benchmarks</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="pricing" className="py-24 border-t border-border bg-background relative overflow-hidden flex items-center justify-center">
        {/* Background Subtle Gradient Glow */}
        <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans">
            Ready to master coding interviews?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans">
            Learn faster, solve smarter, and prepare with confidence. Get started in seconds.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/home">
              <button className="h-12 px-8 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-medium transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer font-sans">
                Start Learning
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/80 bg-background/50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Forcio AI" width={270} height={72} className="h-[72px] w-auto object-contain" />
          </div>

          <p className="text-xs text-muted-foreground font-sans">
            &copy; {new Date().getFullYear()} Forcio AI. Built by developers, for developers. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-sans">
            <a href="#preview" onClick={() => scrollToSection("preview")} className="hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#workflow" onClick={() => scrollToSection("workflow")} className="hover:text-foreground transition-colors">
              Workflow
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
