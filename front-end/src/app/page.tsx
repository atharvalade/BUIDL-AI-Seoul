"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-16 overflow-hidden hero-gradient">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            <span className="block">Cut Through the Noise.</span>
            <span className="block text-black dark:text-white">Get Verified News.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            TrueLens aggregates, verifies, and analyzes news that impacts the financial markets, giving you clarity when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/feed" size="lg">
              Browse Feed
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-6xl mt-16 px-4"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="TrueLens Feed Preview"
              width={1200}
              height={675}
              className="w-full"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent opacity-30"></div>
          </div>
        </motion.div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Why TrueLens Matters
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-300 text-lg"
            >
              In a world of information overload, we provide clarity and accuracy.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified News",
                description: "Every story is verified by our trusted community and AI analysis to ensure accuracy.",
                icon: "/icons/verification.svg"
              },
              {
                title: "Market Insights",
                description: "Get AI-generated summaries and trading suggestions based on verified news.",
                icon: "/icons/insights.svg"
              },
              {
                title: "Decentralized Truth",
                description: "Our blockchain-based verification system incentivizes truth and penalizes misinformation.",
                icon: "/icons/blockchain.svg"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border"
              >
                <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How TrueLens Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-300 text-lg"
            >
              Our advanced platform combines AI and community verification.
            </motion.p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            
            {[
              {
                title: "AI Aggregation",
                description: "Our AI agents continuously scan and collect news from diverse sources across the web.",
                align: "right"
              },
              {
                title: "Community Verification",
                description: "Trusted validators review and verify news content, earning rewards for accurate verification.",
                align: "left"
              },
              {
                title: "Blockchain Storage",
                description: "Verified content is stored on IPFS with hashed verification records on the blockchain.",
                align: "right"
              },
              {
                title: "AI Analysis",
                description: "Our AI generates summaries and assesses potential market impact of each verified story.",
                align: "left"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: step.align === "left" ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative mb-12 md:w-1/2 ${step.align === "left" ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}
              >
                <div className="hidden md:block absolute top-3 bg-white dark:bg-black border rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border relative z-0">
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Ready to Experience Verified News?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/90 text-lg mb-8"
            >
              Join TrueLens today and transform how you consume financial news.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                href="/feed"
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                Browse the Feed
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
