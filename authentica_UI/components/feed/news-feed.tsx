"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NewsCard from "../marketplace/news-card";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  imageUrl: string;
  content: string;
  aiSummary: string;
  tradingInsights: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  verified: boolean;
}

export default function NewsFeed() {
  const [selectedNewsItem, setSelectedNewsItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading news data
    setTimeout(() => {
      setNewsItems([
        {
          id: "1",
          title: "Trump Administration Announces New Tax Cuts for Businesses",
          source: "Reuters",
          date: "2 hours ago",
          summary: "The Trump administration unveiled a comprehensive tax reform plan aimed at stimulating economic growth.",
          imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=2562&ixlib=rb-4.0.3",
          content: "In a major policy announcement today, the Trump administration unveiled a comprehensive tax reform plan that would slash corporate tax rates from 21% to 15%. The proposal, which aims to stimulate economic growth and job creation, also includes provisions for individual tax relief and simplification of the tax code.\n\nTreasury Secretary outlined the details of the plan during a press conference at the White House, emphasizing its potential impact on small businesses and middle-class Americans. 'This is about creating jobs and opportunities for hardworking Americans,' he said.\n\nMarket analysts are already predicting significant movements in both stock and cryptocurrency markets as investors digest the implications of the proposed tax cuts. The Dow Jones Industrial Average jumped 2.3% following the announcement.",
          aiSummary: "The Trump administration has proposed reducing corporate tax rates from 21% to 15%, alongside individual tax relief measures. This announcement is expected to have positive implications for businesses and potentially stimulate economic growth.",
          tradingInsights: "This news is likely to create bullish sentiment for US stocks, particularly in sectors most impacted by corporate tax rates such as retail, manufacturing, and technology. Cryptocurrencies may also see positive movement as reduced taxes could increase institutional investment capacity.",
          sentiment: "positive",
          confidence: 92,
          verified: true
        },
        {
          id: "2",
          title: "Federal Reserve Signals Possible Interest Rate Hike",
          source: "The Guardian",
          date: "5 hours ago",
          summary: "Fed minutes reveal discussions about potential rate increases to combat inflation pressures.",
          imageUrl: "https://images.unsplash.com/photo-1607026091390-6ccc9137de35?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
          content: "Minutes from the Federal Reserve's latest meeting indicate that officials are considering an interest rate hike sooner than previously anticipated. The discussion comes amid rising inflation concerns and stronger economic data.\n\nAccording to the minutes, several committee members expressed the view that if the economy continues to recover at its current pace, it may be appropriate to begin discussing a plan for adjusting the pace of asset purchases and raising the federal funds rate.\n\nThis potential policy shift marks a significant change from the Fed's prior stance, which had emphasized maintaining low rates through 2023. Market participants are now recalibrating their expectations for monetary policy over the coming year.",
          aiSummary: "The Federal Reserve is considering raising interest rates earlier than previously indicated due to inflation concerns and positive economic data, according to recently released meeting minutes.",
          tradingInsights: "This news could create headwinds for growth stocks and cryptocurrencies, which typically perform better in low-interest environments. Consider reducing exposure to high-multiple tech stocks and increasing allocation to financial sector stocks, which often benefit from higher rates.",
          sentiment: "negative",
          confidence: 87,
          verified: true
        },
        {
          id: "3",
          title: "Major Cryptocurrency Exchange Announces New Regulatory Compliance Measures",
          source: "CoinDesk",
          date: "1 day ago",
          summary: "Leading exchange implements enhanced KYC protocols following increased regulatory scrutiny.",
          imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3",
          content: "One of the world's largest cryptocurrency exchanges announced today that it will be implementing stricter Know-Your-Customer (KYC) and Anti-Money Laundering (AML) protocols across its platform. The move comes in response to increased regulatory scrutiny from financial authorities around the world.\n\nThe exchange will now require all users to complete enhanced verification procedures, including providing government-issued identification and proof of address. The company also stated it will be limiting daily withdrawal amounts for accounts that have not completed the full verification process.\n\nIndustry analysts view this development as part of a broader trend toward greater regulation in the cryptocurrency space, with potential implications for market liquidity and institutional adoption.",
          aiSummary: "A major cryptocurrency exchange is implementing stricter KYC and AML protocols in response to regulatory pressures, requiring enhanced user verification and limiting withdrawals for unverified accounts.",
          tradingInsights: "While increased regulation may create short-term volatility in cryptocurrency markets, the long-term effect could be positive by legitimizing the asset class and encouraging institutional participation. Consider maintaining positions in larger, regulatory-compliant cryptocurrencies.",
          sentiment: "neutral",
          confidence: 78,
          verified: true
        },
        {
          id: "4",
          title: "Global Shipping Disruption Threatens Supply Chain Recovery",
          source: "Bloomberg",
          date: "3 days ago",
          summary: "Ongoing port congestion and container shortages raise concerns about economic impact.",
          imageUrl: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c1?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
          content: "Global shipping disruptions continue to worsen as port congestion, container shortages, and labor issues plague major trade routes. The situation threatens to derail the fragile economic recovery and could lead to higher consumer prices across various sectors.\n\nMajor ports in Asia, Europe, and North America are reporting unprecedented backlogs, with some vessels waiting weeks to unload cargo. The delays are causing ripple effects throughout supply chains, with manufacturers reporting production slowdowns due to parts shortages.\n\nMaritime industry experts warn that the disruptions could persist into next year, potentially affecting holiday retail seasons and exacerbating inflation pressures that have already begun to concern policymakers.",
          aiSummary: "Global shipping is experiencing severe disruptions due to port congestion, container shortages, and labor issues, threatening economic recovery and potentially increasing consumer prices.",
          tradingInsights: "This ongoing situation could negatively impact retail and manufacturing stocks dependent on timely imports, while potentially benefiting domestic producers with less exposure to international supply chains. Logistics companies may see mixed results as volume increases but costs rise.",
          sentiment: "negative",
          confidence: 85,
          verified: false
        },
        {
          id: "5",
          title: "Tech Giant Announces Major AI Investment Initiative",
          source: "TechCrunch",
          date: "4 days ago",
          summary: "Company commits $10 billion to artificial intelligence research and development over next five years.",
          imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2020&ixlib=rb-4.0.3",
          content: "A leading technology corporation has announced a $10 billion investment in artificial intelligence research and development over the next five years. The initiative will focus on advancing generative AI models, quantum computing applications, and integration of AI across the company's product ecosystem.\n\nAs part of the announcement, the company revealed plans to double its AI research staff and establish new AI labs in several global technology hubs. The company's CEO emphasized that artificial intelligence represents 'the most transformative technology of our generation' and would be central to the firm's long-term strategy.\n\nAnalysts noted that this substantial commitment highlights the intensifying competition in the AI space among major tech companies, all vying for dominance in what is increasingly seen as the next frontier of technological innovation.",
          aiSummary: "A major tech company has committed $10 billion to AI research and development over five years, focusing on generative AI, quantum computing, and product integration while doubling its AI research staff.",
          tradingInsights: "This significant investment signals confidence in AI technology's future and may boost the company's stock. Consider this positive for the broader tech sector, particularly companies specializing in semiconductors and cloud computing infrastructure needed for AI development.",
          sentiment: "positive",
          confidence: 90,
          verified: true
        }
      ]);
      setSelectedNewsItem("1");
      setIsLoading(false);
    }, 1500);
  }, []);

  // Function to handle search
  const filteredNewsItems = searchQuery.trim() === "" 
    ? newsItems 
    : newsItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.source.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Function to handle selecting a news item
  const handleSelectNews = (news: NewsItem) => {
    setSelectedNewsItem(news.id);
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 text-green-700 border-green-200";
      case "negative":
        return "bg-red-50 text-red-700 border-red-200";
      case "neutral":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "negative":
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 16C16 16 14.5 14 12 14C9.5 14 8 16 8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
    }
  };

  const selectedNews = newsItems.find((item) => item.id === selectedNewsItem);

  return (
    <>
      {/* This wrapper ensures full coverage with white background and fixes footer issues */}
      <style jsx global>{`
        body {
          background: white !important;
        }
        
        /* Override any gradient backgrounds from parent components */
        main {
          background: white !important;
          padding: 0 !important;
        }
        
        /* Hide the original footer with gradient */
        .footer-container, footer, 
        main > div > div:last-child:not(.news-feed-container) {
          display: none !important;
        }
      `}</style>
      
      <div className="w-full flex flex-col news-feed-container">
        {/* Remove duplicate header - the site already has a header with navigation */}
        
        {/* News feed layout - Full-width container with proper spacing */}
        <div className="flex flex-col md:flex-row w-full h-[calc(100vh-5rem)]">
          {/* News items sidebar - Redesigned with improved item separation */}
          <div className="w-full md:w-[350px] bg-white h-full flex flex-col shadow-sm">
            <div className="px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs uppercase tracking-wider text-slate-500 font-medium">LATEST NEWS</h2>
                <div className="flex items-center space-x-1">
                  <div className="bg-slate-100 rounded-full h-5 w-5 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <div className="bg-slate-100 rounded-full h-5 w-5 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-200"
                />
                {searchQuery ? (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-3 top-2.5"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-3 top-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 py-3 divide-y divide-slate-100/80">
              {isLoading ? (
                <div className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
                  <p className="mt-4 text-slate-600 text-sm">Loading news...</p>
                </div>
              ) : filteredNewsItems.length === 0 ? (
                <div className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-sm font-medium">No results found</p>
                  <p className="text-slate-500 text-xs mt-1">Try different search terms</p>
                </div>
              ) : (
                filteredNewsItems.map((item, index) => (
                  <div className="py-2" key={item.id}>
                    <button
                      onClick={() => setSelectedNewsItem(item.id)}
                      className={`w-full text-left p-3 hover:bg-slate-50 transition-all duration-200 rounded-xl ${
                        selectedNewsItem === item.id 
                          ? "bg-slate-50 ring-1 ring-slate-200/70 shadow-sm" 
                          : "bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.source === "Reuters"
                              ? "bg-blue-50 text-blue-700"
                              : item.source === "Bloomberg"
                              ? "bg-purple-50 text-purple-700"
                              : item.source === "The Guardian"
                              ? "bg-amber-50 text-amber-700"
                              : item.source === "CoinDesk"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {item.source}
                        </span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <h3 className="font-medium text-slate-900 line-clamp-2 leading-snug text-sm">{item.title}</h3>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* News content */}
          <div className="hidden md:flex flex-1 h-full bg-slate-50/80 backdrop-blur-sm overflow-y-auto border-l border-slate-100">
            {selectedNewsItem ? (
              <div className="w-full max-w-3xl mx-auto px-8 py-12">
                {selectedNews && (
                  <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] p-8 ring-1 ring-slate-200/50">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedNews.source === "Reuters"
                                ? "bg-blue-100/70 text-blue-800"
                                : selectedNews.source === "Bloomberg"
                                ? "bg-purple-100/70 text-purple-800"
                                : "bg-orange-100/70 text-orange-800"
                            }`}
                          >
                            {selectedNews.source}
                          </span>
                          <span className="text-sm text-slate-500">{selectedNews.date}</span>
                        </div>
                        <div className="flex items-center">
                          <div 
                            className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              selectedNews.verified 
                                ? "bg-green-100/70 text-green-800 border border-green-200/70" 
                                : "bg-red-100/70 text-red-800 border border-red-200/70"
                            }`}
                          >
                            <svg 
                              className={`w-3.5 h-3.5 mr-1 ${selectedNews.verified ? "text-green-500" : "text-red-500"}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              {selectedNews.verified ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              )}
                            </svg>
                            {selectedNews.verified ? "Verified" : "Not Verified"}
                          </div>
                        </div>
                      </div>
                      <h1 className="text-3xl font-semibold text-slate-900 leading-tight mb-5">{selectedNews.title}</h1>
                      <div className="flex items-center justify-between mt-7 mb-9">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-slate-600">Factual Rating:</span>
                            <div className="relative inline-flex">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <svg
                                    key={rating}
                                    className={`w-4 h-4 ${
                                      rating <= 4 ? "text-yellow-400" : "text-slate-200"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="h-4 w-px bg-slate-200"></div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-slate-600">Bias Rating:</span>
                            <span className="text-sm font-medium text-slate-900">Center-Right</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-slate-500">5 min read</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedNews.imageUrl && (
                      <div className="mb-9 -mx-8">
                        <img
                          src={selectedNews.imageUrl}
                          alt={selectedNews.title}
                          className="w-full h-[320px] object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                    
                    <div className="prose prose-slate max-w-none">
                      {selectedNews.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-5 text-slate-700 leading-relaxed text-base">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-slate-100">
                      <h3 className="font-medium text-slate-900 mb-3">AI Analysis</h3>
                      <div className="bg-slate-50 rounded-xl p-5 ring-1 ring-slate-100">
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h4 className="font-medium text-slate-900">Summary</h4>
                          </div>
                          <p className="text-slate-700 text-sm">{selectedNews.aiSummary}</p>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <h4 className="font-medium text-slate-900">Trading Insights</h4>
                          </div>
                          <p className="text-slate-700 text-sm">{selectedNews.tradingInsights}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-slate-100">
                      <h3 className="font-medium text-slate-900 mb-3">Verification Details</h3>
                      <div className="bg-slate-50 rounded-xl p-5 ring-1 ring-slate-100">
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Verified by</p>
                            <p className="text-sm font-medium text-slate-900">TrueLens Analytics</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Verification Date</p>
                            <p className="text-sm font-medium text-slate-900">Today, 9:45 AM</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Accuracy Score</p>
                            <p className="text-sm font-medium text-slate-900">{selectedNews.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Sources</p>
                            <p className="text-sm font-medium text-slate-900">3 sources</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors duration-200"
                      >
                        Read Full Analysis
                      </button>
                      <button
                        className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors duration-200"
                      >
                        View Source
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center p-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6m2 6V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h9a2 2 0 002-2zm-9-9h4m-4 3h2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-slate-900 mb-2">Select a news article</h3>
                  <p className="text-slate-500 max-w-md mx-auto">Choose an article from the list to view its content and analysis</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Custom footer with proper white background */}
        <div className="w-full py-3 border-t border-slate-100 mt-auto bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-slate-500">TrueLens - Verified News for Better Trading</p>
            <p className="text-xs text-slate-400 mt-1">© {new Date().getFullYear()} TrueLens. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
} 