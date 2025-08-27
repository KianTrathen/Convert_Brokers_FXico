"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Play,
  TrendingUp,
  Users,
  Brain,
  BarChart3,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Calculator,
  MessageCircle,
  Download,
  X,
  Target,
  User,
  Code,
} from "lucide-react"

// UTM persistence utility
const getUTMParams = () => {
  if (typeof window === "undefined") return {}
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get("utm_source") || "",
    utm_medium: urlParams.get("utm_medium") || "",
    utm_campaign: urlParams.get("utm_campaign") || "",
    utm_content: urlParams.get("utm_content") || "",
    utm_term: urlParams.get("utm_term") || "",
  }
}

const appendUTMs = (url: string) => {
  const utms = getUTMParams()
  const urlObj = new URL(url)
  Object.entries(utms).forEach(([key, value]) => {
    if (value) urlObj.searchParams.set(key, value)
  })
  return urlObj.toString()
}

// GA4 event tracking
const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", eventName, parameters)
  }
}

export default function ConverticoLanding() {
  const [selectedPersona, setSelectedPersona] = useState<"launching" | "established">("established")
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showDeliverablesModal, setShowDeliverablesModal] = useState(false)
  const [activeSection, setActiveSection] = useState("why")
  const [calculatorValues, setCalculatorValues] = useState({
    sessions: 50000,
    currentRate: 2.0,
    targetRate: 3.5,
    ftdRate: 35,
    ltv: 600,
    months: 12,
  })
  const [calculatedLTV, setCalculatedLTV] = useState(0)

  // Calculate LTV loss
  useEffect(() => {
    const lostLTV =
      calculatorValues.sessions *
      ((calculatorValues.targetRate - calculatorValues.currentRate) / 100) *
      (calculatorValues.ftdRate / 100) *
      calculatorValues.ltv *
      (calculatorValues.months / 12)
    setCalculatedLTV(Math.round(lostLTV))
  }, [calculatorValues])

  // Scroll tracking
  useEffect(() => {
    const fired: Record<number, boolean> = {}
    const handleScroll = () => {
      const denom = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = denom > 0 ? (window.scrollY / denom) * 100 : 0
      ;[25, 50, 75, 100].forEach((mark) => {
        if (scrollPercent >= mark && !fired[mark]) {
          fired[mark] = true
          trackEvent("scroll_depth", { depth: mark })
        }
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // In-section scrollspy for Trust & Education mini-nav
  useEffect(() => {
    const ids = ["why", "pillars", "process", "credentials"]
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleCTAClick = (type: "primary" | "secondary") => {
    trackEvent(type === "primary" ? "cta_click_primary" : "cta_click_secondary")
    window.open(appendUTMs("https://growth.convertico.co.za"), "_blank")
  }

  const handleDeliverablesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDeliverablesModal(true)
    trackEvent("deliverables_modal_open")
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-brand-bg/80 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-primary">Convertico</div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-sm hover:text-brand-accent transition-colors">
              Hero
            </a>
            <a href="#why" className="text-sm hover:text-brand-accent transition-colors">
              Why
            </a>
            <a href="#calculator" className="text-sm hover:text-brand-accent transition-colors">
              Calculator
            </a>
            <a href="#process" className="text-sm hover:text-brand-accent transition-colors">
              Process
            </a>
            <a href="#proof" className="text-sm hover:text-brand-accent transition-colors">
              Proof
            </a>
            <a href="#faq" className="text-sm hover:text-brand-accent transition-colors">
              FAQ
            </a>
            <Button
              onClick={() => handleCTAClick("primary")}
              className="bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl px-5 py-3 font-semibold hover-lift"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="py-16 px-0 md:py-5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              CRO websites that turn <span className="text-brand-primary">FX traffic</span> into traders&apos; room{" "}
              <span className="text-brand-primary">sign-ups</span>
            </h1>
            <p className="text-xl text-brand-muted mb-8 leading-relaxed max-w-3xl mx-auto">
              Watch to see how we Educate &gt; Attribute &gt; Nudge &gt; Convert
            </p>
          </div>

          {/* VSL Video - Full Width */}
          <div className="mb-12">
            <div
              className="relative cursor-pointer hover-lift max-w-5xl mx-auto"
              onClick={() => {
                setShowVideoModal(true)
                trackEvent("video_play")
              }}
            >
              <div className="aspect-video bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 rounded-xl flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* CTAs Below VSL */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => handleCTAClick("primary")}
              className="bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl px-8 py-4 text-lg font-semibold hover-lift"
            >
              Apply Now
            </Button>
          </div>

          {/* Trust Logos */}
        </div>
      </section>

      {/* Partners Ribbon */}
      <section className="py-8">
        <div className="px-0">
          <div className="relative overflow-hidden w-full border-y border-white/10 bg-gradient-to-r from-brand-card/60 via-brand-card/40 to-brand-card/60 py-4">
            {/* edge fades */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-brand-bg to-transparent" aria-hidden="true"></div>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-brand-bg to-transparent" aria-hidden="true"></div>

            <div className="flex items-center gap-0 w-max will-change-transform animate-[marqueeX_28s_linear_infinite]">
              {/* Group 1 */}
              <div className="flex items-center gap-8 px-4 md:px-6">
                {(["ChatGPT", "GoHighLevel", "n8n", "Adobe", "Slack", "WhatsApp", "Cursor"]).map((brand, i) => (
                  <div key={`g1-${i}`} className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-brand-bg/60 px-5 py-3 shadow-sm hover-lift">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-primary/80 to-brand-accent/80"></div>
                    <span className="text-sm text-brand-muted">{brand}</span>
                  </div>
                ))}
              </div>
              {/* Group 2 (duplicate) */}
              <div className="flex items-center gap-8 px-4 md:px-6" aria-hidden="true">
                {(["ChatGPT", "GoHighLevel", "n8n", "Adobe", "Slack", "WhatsApp", "Cursor"]).map((brand, i) => (
                  <div key={`g2-${i}`} className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-brand-bg/60 px-5 py-3 shadow-sm hover-lift">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-primary/80 to-brand-accent/80"></div>
                    <span className="text-sm text-brand-muted">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-brand-primary to-black rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
                  HOW THE CGS CAN <span className="text-white">DOUBLE YOUR SIGN-UPS</span> IN 2025
                </h2>
                <p className="text-xl text-white/90 mb-4 leading-relaxed">
                  Our step-by-step approach on how we use AI, data and CRO to scale FX brokers.
                </p>
                <p className="text-lg text-white/80 mb-8">Get Resources Here:</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      trackEvent("resource_download", { resource: "funnel_framework" })
                      window.open("#", "_blank")
                    }}
                    className="bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl px-6 py-3 font-semibold hover-lift flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Funnel Framework
                  </Button>
                  <Button
                    onClick={() => {
                      trackEvent("resource_download", { resource: "process_doc" })
                      window.open("#", "_blank")
                    }}
                    className="bg-black hover:bg-gray-900 text-white rounded-xl px-6 py-3 font-semibold hover-lift flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Process Doc
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 ml-2">The Quantum Growth Model</span>
                  </div>
                </div>
                <div className="aspect-[4/3] bg-white border rounded-lg p-4 text-black">
                  <h3 className="text-lg font-bold mb-2">
                    The Compound Growth System: Why CRO KPIs are the most important mechanism to drive real growth for
                    FX Brokers in 2025
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Author: Tyne Potgieter, BCom LLB, CEO of Convertico</p>
                  <div className="space-y-2 text-sm text-gray-800">
                    <p>
                      <strong>Abstract:</strong>
                    </p>
                    <p>
                      For online business owners scaling from multi-7 to 8 figures and beyond in annual revenue, paid
                      advertising and market fit have likely validated the initial business case.
                    </p>
                    <p>However, scaling further has become increasingly challenging in 2025.</p>
                    <p>
                      The internet economy's rapid growth has led to an influx of advertisers vying for limited
                      advertising space, driving up competition and ad costs. As a result, many businesses are
                      struggling to maintain profitability while scaling.
                    </p>
                    <p>
                      This paper argues and seeks to show you that the most effective strategy for sustainable growth
                      lies in the Convertico Quantum Growth Model which prioritizes Conversion Rate Optimization (CRO)
                      through measurable Key Performance Indicators (KPIs).
                    </p>
                  </div>
                  <div className="mt-4 bg-red-600 text-white p-2 rounded flex items-center justify-center">
                    <Play className="w-6 h-6" />
                    <span className="ml-2 text-sm">45:37</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Strip */}

      {/* LTV Loss Calculator */}
      <section id="calculator" className="py-16 bg-brand-card">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Calculator className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">LTV Loss Calculator</h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
              See exactly how much lifetime value you&apos;re losing with poor conversion rates
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="space-y-8">
              <div>
                <Label className="text-sm font-medium mb-2 block">Monthly Site Sessions</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calculatorValues.sessions]}
                    onValueChange={(value) => {
                      setCalculatorValues((prev) => ({ ...prev, sessions: value[0] }))
                      trackEvent("calculator_change", { field: "sessions", value: value[0] })
                    }}
                    max={200000}
                    min={10000}
                    step={5000}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calculatorValues.sessions}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({ ...prev, sessions: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="w-24 bg-brand-bg border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Current Sign-up Rate (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calculatorValues.currentRate]}
                    onValueChange={(value) => {
                      setCalculatorValues((prev) => ({ ...prev, currentRate: value[0] }))
                      trackEvent("calculator_change", { field: "currentRate", value: value[0] })
                    }}
                    max={10}
                    min={0.5}
                    step={0.1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calculatorValues.currentRate}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({ ...prev, currentRate: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="w-24 bg-brand-bg border-white/20"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Target Sign-up Rate (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calculatorValues.targetRate]}
                    onValueChange={(value) => {
                      setCalculatorValues((prev) => ({ ...prev, targetRate: value[0] }))
                      trackEvent("calculator_change", { field: "targetRate", value: value[0] })
                    }}
                    max={15}
                    min={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calculatorValues.targetRate}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({ ...prev, targetRate: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="w-24 bg-brand-bg border-white/20"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">First Deposit Rate (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calculatorValues.ftdRate]}
                    onValueChange={(value) => {
                      setCalculatorValues((prev) => ({ ...prev, ftdRate: value[0] }))
                      trackEvent("calculator_change", { field: "ftdRate", value: value[0] })
                    }}
                    max={80}
                    min={10}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calculatorValues.ftdRate}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({ ...prev, ftdRate: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="w-24 bg-brand-bg border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Average LTV per Funded Trader (USD)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calculatorValues.ltv]}
                    onValueChange={(value) => {
                      setCalculatorValues((prev) => ({ ...prev, ltv: value[0] }))
                      trackEvent("calculator_change", { field: "ltv", value: value[0] })
                    }}
                    max={2000}
                    min={200}
                    step={50}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calculatorValues.ltv}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({ ...prev, ltv: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="w-24 bg-brand-bg border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Time Horizon (Months)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calculatorValues.months]}
                    onValueChange={(value) => {
                      setCalculatorValues((prev) => ({ ...prev, months: value[0] }))
                      trackEvent("calculator_change", { field: "months", value: value[0] })
                    }}
                    max={24}
                    min={3}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calculatorValues.months}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({ ...prev, months: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="w-24 bg-brand-bg border-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-brand-bg rounded-2xl p-8 h-full flex flex-col">
              <h3 className="text-2xl font-semibold mb-6 text-center">Lost LTV Opportunity</h3>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-brand-primary count-up">${calculatedLTV.toLocaleString()}</div>
                <p className="text-brand-muted mt-2">Over {calculatorValues.months} months</p>
              </div>

              

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold">Impact of Sign-up Rate Improvements:</h4>
                <div className="space-y-3">
                  {/* +1pp row */}
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent px-5 py-4">
                    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl bg-gradient-to-tr from-brand-accent/20 via-transparent to-transparent" />
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-3 py-1 text-sm text-black">+1pp <TrendingUp className="w-4 h-4 text-black" /></span>
                      <span className="text-3xl md:text-4xl font-bold text-brand-accent tracking-tight">$
                        {Math.round(
                          calculatorValues.sessions * (1 / 100) * (calculatorValues.ftdRate / 100) * calculatorValues.ltv * (calculatorValues.months / 12),
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* +2pp row */}
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent px-5 py-4">
                    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl bg-gradient-to-tr from-brand-accent/25 via-transparent to-transparent" />
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-3 py-1 text-sm text-black">+2pp <TrendingUp className="w-4 h-4 text-black" /></span>
                      <span className="text-3xl md:text-4xl font-bold text-brand-accent tracking-tight">$
                        {Math.round(
                          calculatorValues.sessions * (2 / 100) * (calculatorValues.ftdRate / 100) * calculatorValues.ltv * (calculatorValues.months / 12),
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* +3pp row */}
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent px-5 py-4">
                    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl bg-gradient-to-tr from-brand-accent/30 via-transparent to-transparent" />
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-3 py-1 text-sm text-black">+3pp <TrendingUp className="w-4 h-4 text-black" /></span>
                      <span className="text-3xl md:text-4xl font-bold text-brand-accent tracking-tight">$
                        {Math.round(
                          calculatorValues.sessions * (3 / 100) * (calculatorValues.ftdRate / 100) * calculatorValues.ltv * (calculatorValues.months / 12),
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  handleCTAClick("primary")
                  trackEvent("calculator_submit", { lostLTV: calculatedLTV })
                }}
                className="w-full bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl py-5 text-base font-semibold hover-lift shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
              >
                Apply Now to Unlock This Upside
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Education Unified Section - start */}
      <section id="trust" className="relative py-8 bg-gradient-to-b from-brand-bg via-brand-card/30 to-brand-bg">
        <nav className="hidden xl:flex fixed left-6 top-28 z-40 flex-col gap-2">
          <a href="#why" className={`px-3 py-2 rounded-lg border text-sm transition-colors ${activeSection === "why" ? "border-white/40 text-white" : "border-white/10 text-brand-muted hover:text-white hover:border-white/30"}`}>Why Convertico</a>
          <a href="#pillars" className={`px-3 py-2 rounded-lg border text-sm transition-colors ${activeSection === "pillars" ? "border-white/40 text-white" : "border-white/10 text-brand-muted hover:text-white hover:border-white/30"}`}>Our Solutions</a>
          <a href="#process" className={`px-3 py-2 rounded-lg border text-sm transition-colors ${activeSection === "process" ? "border-white/40 text-white" : "border-white/10 text-brand-muted hover:text-white hover:border-white/30"}`}>Our Process</a>
          <a href="#credentials" className={`px-3 py-2 rounded-lg border text-sm transition-colors ${activeSection === "credentials" ? "border-white/40 text-white" : "border-white/10 text-brand-muted hover:text-white hover:border-white/30"}`}>FX Credentials</a>
        </nav>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="rounded-3xl border border-white/10 bg-brand-card/20 backdrop-blur-sm p-2 md:p-6">
      {/* Why Convertico */}
      <section id="why" className="py-16 bg-transparent scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">Why Convertico</h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              The only FX CRO agency with deep market expertise and AI-powered solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-card/80 border border-white/20 hover:border-brand-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20">
              <CardContent className="p-8 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    We Know FX
                  </h3>
                  <ul className="space-y-3 text-brand-muted text-sm leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      6+ years operating in FX markets
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      Deep customer-avatar insight
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      Sites aligned with KYC/compliance
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      Real trading journey optimization
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-card/80 border border-white/20 hover:border-brand-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20">
              <CardContent className="p-8 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    We Build AI In
                  </h3>
                  <ul className="space-y-3 text-brand-muted text-sm leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      In-house AI engineers
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      Deploy AI concierge for education Q&A
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      Handle objections automatically
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      Seamless handoff to WhatsApp/live chat
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          
        </div>
      </section>

      <div className="relative my-4 md:my-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-6 h-6 rounded-full bg-brand-card border border-white/10 flex items-center justify-center text-[10px] text-brand-muted">1</div>
      </div>

      {/* Solution Pillars */}
      <section id="pillars" className="py-16 bg-transparent scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">
              Our <span className="text-brand-accent">Solutions</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              Four core systems that transform your FX website into a conversion powerhouse
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-card/80 border border-white/20 hover:border-brand-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20">
              <CardContent className="p-8 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    FX CRO Architecture
                  </h3>
                  <ul className="space-y-3 text-brand-muted text-sm leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Information scent → sign-up
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Friction cut
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Proof stacked
                    </li>
                  </ul>
                  <button
                    onClick={handleDeliverablesClick}
                    className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium mt-6 hover:text-brand-accent transition-colors group-hover:translate-x-1 transform duration-300"
                  >
                    See deliverables
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-card/80 border border-white/20 hover:border-brand-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20">
              <CardContent className="p-8 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    Education That Converts
                  </h3>
                  <ul className="space-y-3 text-brand-muted text-sm leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Account-type explainer flows
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Interactive calculators
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Confident sign-ups
                    </li>
                  </ul>
                  <button
                    onClick={handleDeliverablesClick}
                    className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium mt-6 hover:text-brand-accent transition-colors group-hover:translate-x-1 transform duration-300"
                  >
                    See deliverables
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-card/80 border border-white/20 hover:border-brand-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20">
              <CardContent className="p-8 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    Full-Funnel Attribution
                  </h3>
                  <ul className="space-y-3 text-brand-muted text-sm leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      UTMs → CRM → traders' room
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Stop guessing campaigns
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Scale what works
                    </li>
                  </ul>
                  <button
                    onClick={handleDeliverablesClick}
                    className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium mt-6 hover:text-brand-accent transition-colors group-hover:translate-x-1 transform duration-300"
                  >
                    See deliverables
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-card/80 border border-white/20 hover:border-brand-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20">
              <CardContent className="p-8 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    On-site AI Concierge
                  </h3>
                  <ul className="space-y-3 text-brand-muted text-sm leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>A "free
                      employee"
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      Nudging visitors to sign up
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      24/7 objection handling
                    </li>
                  </ul>
                  <button
                    onClick={handleDeliverablesClick}
                    className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium mt-6 hover:text-brand-accent transition-colors group-hover:translate-x-1 transform duration-300"
                  >
                    See deliverables
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="relative my-4 md:my-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-6 h-6 rounded-full bg-brand-card border border-white/10 flex items-center justify-center text-[10px] text-brand-muted">2</div>
      </div>

      {/* Process */}
      <section id="process" className="py-16 bg-transparent scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="font-semibold text-center mb-12 text-5xl">Our Process</h2>
          <div className="relative">
            <div className="absolute left-8 right-8 top-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="relative bg-gradient-to-br from-brand-card to-brand-card/70 border-white/10 p-8 hover-lift overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-brand-primary/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="text-xl font-semibold">Audit &amp; Spec</h3>
                  </div>
                  <ul className="space-y-2 text-brand-muted text-sm">
                    <li>Heuristic + analytics review</li>
                    <li>Traders&apos; room mapping</li>
                    <li>CRO spec + tracking plan</li>
                  </ul>
                </div>
              </Card>

              <Card className="relative bg-gradient-to-br from-brand-card to-brand-card/70 border-white/10 p-8 hover-lift overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-brand-accent/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="text-xl font-semibold">Build &amp; Integrate</h3>
                  </div>
                  <ul className="space-y-2 text-brand-muted text-sm">
                    <li>UX copy, design/dev</li>
                    <li>UTM persistence</li>
                    <li>AI concierge integration</li>
                    <li>Analytics setup</li>
                  </ul>
                </div>
              </Card>

              <Card className="relative bg-gradient-to-br from-brand-card to-brand-card/70 border-white/10 p-8 hover-lift overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-brand-primary/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="text-xl font-semibold">Test &amp; Scale</h3>
                  </div>
                  <ul className="space-y-2 text-brand-muted text-sm">
                    <li>A/B test headlines/forms/proof</li>
                    <li>Weekly reporting</li>
                    <li>Sign-up lift tracking</li>
                    <li>Source ROI analysis</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="relative my-4 md:my-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-6 h-6 rounded-full bg-brand-card border border-white/10 flex items-center justify-center text-[10px] text-brand-muted">3</div>
      </div>

      {/* Personalization Gate */}

      {/* FX Credentials (industry-leading) */}
      <section id="credentials" className="py-20 bg-transparent scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text">Our Team</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Practical FX, CRO and AI experience forged in live broker environments.
            </p>
          </div>

          

          {/* Founders cards with timelines and credibility bullets */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-brand-card to-brand-card/70 p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-brand-primary/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary/60 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">Marcus Chen</h3>
                    <p className="text-brand-primary text-sm">FX & CRO Expert</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-brand-muted">
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2"></div> Founded FXPro Analytics — $2M ARR serving 50+ brokers</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2"></div> MetaTrader-integrated CRO systems, attribution to CRM</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2"></div> 8+ years improving FX funnel conversion with measurable lifts</li>
                </ul>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-brand-card to-brand-card/70 p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-brand-accent/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent/60 flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">Sarah Rodriguez</h3>
                    <p className="text-brand-accent text-sm">AI & Development Lead</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-brand-muted">
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2"></div> Co-founded TradeTech Solutions — automated onboarding for 100+ brokers</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2"></div> AI lead scoring + concierge; seamless handoff to live chat/WhatsApp</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2"></div> 10+ years building high-performance trading infrastructure</li>
                </ul>
              </div>
            </div>
          </div>

          

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button onClick={() => handleCTAClick("primary")} className="bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl px-8 py-4 text-lg font-semibold hover-lift">
              Work with the team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

          </div>
        </div>
      </section>

      {/* De-optimization Warning Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-brand-card/40 p-6 md:p-12">
            {/* Background image block */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute right-[-10%] top-[-10%] w-[60%] aspect-square rounded-3xl bg-gradient-to-br from-brand-primary/25 to-transparent blur-2xl" />
              <div className="absolute left-[-20%] bottom-[-20%] w-[50%] aspect-square rounded-full bg-gradient-to-tr from-brand-primary/15 to-transparent blur-3xl" />
            </div>
            {/* Header two lines */}
            <h3 className="relative z-10 text-4xl md:text-5xl font-extrabold leading-tight max-w-4xl">
              <span className="text-brand-primary">Don’t waste LTV</span> Driving Traffic To An Unoptimised,
              Unguided Website
            </h3>

            <div className="mt-10 grid md:grid-cols-4 gap-4">
              {[{
                title: "conversion rates",
                desc: "Unguided websites distract shoppers with too many links and options",
              }, {
                title: "average order value",
                desc: "Most product display pages drive single product orders with lower average order value",
              }, {
                title: "profit per order",
                desc: "First order profit isn't enough to afford scaling paid ads with CAC increasing",
              }, {
                title: "confidence",
                desc: "Can’t scale with confidence due to uncertainty of what’s working in your funnel",
              }].map((item, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-tr from-brand-primary/20 via-transparent to-transparent" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-400 mb-3">
                      <ArrowDown className="w-4 h-4" /> Lower
                    </div>
                    <h4 className="text-lg font-semibold mb-2 capitalize">{item.title}</h4>
                    <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-brand-card">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="ads" className="border-white/10">
                <AccordionTrigger
                  className="text-left hover:text-brand-accent"
                  onClick={() => trackEvent("faq_toggle", { question: "ads" })}
                >
                  Do you manage ads or just the website?
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted">
                  We focus on the website conversion optimization. However, we ensure proper attribution tracking so you
                  can see which ad campaigns are bringing profitable traders, not just clicks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="timeline" className="border-white/10">
                <AccordionTrigger
                  className="text-left hover:text-brand-accent"
                  onClick={() => trackEvent("faq_toggle", { question: "timeline" })}
                >
                  What&apos;s the timeline to launch?
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted">
                  Typically 4-6 weeks from project kickoff to live site. This includes audit, design, development, AI
                  integration, and testing phases.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compliance" className="border-white/10">
                <AccordionTrigger
                  className="text-left hover:text-brand-accent"
                  onClick={() => trackEvent("faq_toggle", { question: "compliance" })}
                >
                  How do you handle compliance requirements?
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted">
                  We build compliance-ready disclaimers and ensure all copy avoids performance promises. We focus on
                  conversion lift messaging, not trading outcome guarantees.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="guarantee" className="border-white/10">
                <AccordionTrigger
                  className="text-left hover:text-brand-accent"
                  onClick={() => trackEvent("faq_toggle", { question: "guarantee" })}
                >
                  What exactly does the money-back guarantee cover?
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted">
                  If we don&apos;t achieve a measurable improvement in your sign-up conversion rate within 90 days of
                  launch, we&apos;ll refund your investment. Terms apply - contact us for full details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crm" className="border-white/10">
                <AccordionTrigger
                  className="text-left hover:text-brand-accent"
                  onClick={() => trackEvent("faq_toggle", { question: "crm" })}
                >
                  Can you integrate with our existing CRM?
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted">
                  Yes, we build attribution plumbing that connects UTM parameters through to your CRM and traders&apos;
                  room. We work with most major CRM systems used in FX.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="multilingual" className="border-white/10">
                <AccordionTrigger
                  className="text-left hover:text-brand-accent"
                  onClick={() => trackEvent("faq_toggle", { question: "multilingual" })}
                >
                  Do you support multilingual sites?
                </AccordionTrigger>
                <AccordionContent className="text-brand-muted">
                  Absolutely. We can build multilingual versions optimized for different markets, with the AI concierge
                  supporting multiple languages for global reach.
                  <div className="mt-4 p-4 bg-brand-bg rounded-lg">
                    <p className="text-sm">
                      Ready to get started?{" "}
                      <Button
                        onClick={() => handleCTAClick("primary")}
                        className="ml-2 bg-brand-primary hover:bg-brand-primary-600 text-white px-4 py-1 text-sm"
                      >
                        Apply Now
                      </Button>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Let&apos;s Turn Traffic Into Traders</h2>
          <p className="text-xl text-brand-muted mb-8 max-w-2xl mx-auto">
            If we don&apos;t measurably move your sign-ups, you get your money back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => handleCTAClick("primary")}
              className="bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl px-8 py-4 text-lg font-semibold hover-lift"
            >
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => handleCTAClick("secondary")}
              variant="outline"
              className="border border-white/20 hover:border-white/40 text-brand-text rounded-xl px-8 py-4 text-lg bg-transparent"
            >
              Schedule Strategy Session
            </Button>
          </div>
          <div className="text-center">
            <Badge className="rounded-full bg-white/10 text-brand-text px-4 py-2">
              <Shield className="w-4 h-4 mr-2 inline-block" />
              Results guaranteed or money back
            </Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-brand-card border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-brand-primary mb-4">Convertico</div>
              <p className="text-brand-muted text-sm">
                CRO websites that turn FX traffic into traders&apos; room sign-ups.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-brand-muted">
                <p>hello@convertico.co.za</p>
                <p>Cape Town, South Africa</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-brand-muted">
                <a href="#" className="hover:text-brand-accent">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-brand-accent">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <details className="text-xs text-brand-muted">
              <summary className="cursor-pointer hover:text-brand-accent mb-2">FX Risk Disclaimer</summary>
              <p>
                Trading foreign exchange on margin carries a high level of risk and may not be suitable for all
                investors. Past performance is not indicative of future results. This website is for educational
                purposes only and does not constitute investment advice.
              </p>
            </details>
          </div>

          <div className="mt-4 text-center text-xs text-brand-muted">© 2024 Convertico. All rights reserved.</div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-card rounded-2xl p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">How We Turn Traffic Into Traders</h3>
              <Button
                variant="ghost"
                onClick={() => setShowVideoModal(false)}
                className="text-brand-muted hover:text-white"
              >
                ✕
              </Button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 rounded-xl flex items-center justify-center">
              <p className="text-brand-muted">Video player would be embedded here</p>
            </div>
          </div>
        </div>
      )}

      {/* Deliverables Modal with scrollable content */}
      {showDeliverablesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-card rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">What You Get</h3>
              <Button
                variant="ghost"
                onClick={() => setShowDeliverablesModal(false)}
                className="text-brand-muted hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Single-page FX CRO site (modular blocks)",
                  "Account-type education + comparison module",
                  "Attribution plumbing (UTMs → CRM) + reporting template",
                  "AI Concierge (site chat) + WhatsApp/email handoff",
                  "Performance optimized (sub-2.5s LCP), accessibility (AA)",
                  "Compliance-ready disclaimers",
                  "Documentation: tracking schema + growth playbook",
                ].map((item, index) => (
                  <Card key={index} className="bg-brand-bg border-white/10 p-6 hover-lift">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-success mt-1 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button
                  onClick={() => {
                    setShowDeliverablesModal(false)
                    handleCTAClick("primary")
                  }}
                  className="bg-brand-primary hover:bg-brand-primary-600 text-white rounded-xl px-8 py-3 font-semibold hover-lift"
                >
                  Apply Now to Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
