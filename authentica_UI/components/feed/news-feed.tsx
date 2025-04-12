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
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

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
      setSelectedNews({
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
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  // Function to handle selecting a news item
  const handleSelectNews = (news: NewsItem) => {
    setSelectedNews(news);
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

  return (
    <div className="w-full flex flex-col">
      {/* Hero section with title and description - Full-width with improved Apple-like styling */}
      <div className="w-full bg-[#0F172A] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-16 md:py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Your Verified News Feed</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Authentic news from verified sources to help you make better trading decisions.
          </p>
        </div>
      </div>
      
      {/* News feed layout - Full-width container with proper Apple-like spacing */}
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-13rem)] border-t border-gray-200">
        {/* News items sidebar */}
        <div className="w-full md:w-[360px] bg-white border-r border-gray-200 h-full flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest News</h2>
            <p className="text-sm text-gray-500">Verified by TrueLens</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading news...</p>
              </div>
            ) : (
              <motion.div 
                className="divide-y divide-gray-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {newsItems.map((news) => (
                  <motion.div 
                    key={news.id}
                    className={`cursor-pointer transition-all ${selectedNews?.id === news.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelectNews(news)}
                    variants={itemVariants}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`
                          text-xs font-medium px-2 py-0.5 rounded-full
                          ${news.source === "Reuters" ? "bg-blue-600 text-white" : 
                            news.source === "The Guardian" ? "bg-purple-600 text-white" : 
                            news.source === "CoinDesk" ? "bg-yellow-600 text-white" : 
                            news.source === "Bloomberg" ? "bg-red-600 text-white" : 
                            news.source === "TechCrunch" ? "bg-green-600 text-white" : "bg-gray-600 text-white"}
                        `}>
                          {news.source}
                        </div>
                        <span className="text-xs text-gray-500">{news.date}</span>
                        
                        {/* Verification badge */}
                        {news.verified && (
                          <div className="bg-green-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="text-[10px]">
                              {news.confidence}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <img 
                            src={news.imageUrl} 
                            alt={news.title}
                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{news.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{news.summary}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Content viewer - Improved styling with Apple-like attention to detail */}
        <div className="w-full flex-1 bg-white overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedNews ? (
              <motion.div
                key={selectedNews.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto p-6 md:p-12"
              >
                {/* Header with source and date */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div className={`
                    ${selectedNews.source === "Reuters" ? "bg-blue-600" : 
                      selectedNews.source === "The Guardian" ? "bg-purple-600" : 
                      selectedNews.source === "CoinDesk" ? "bg-yellow-600" : 
                      selectedNews.source === "Bloomberg" ? "bg-red-600" : 
                      selectedNews.source === "TechCrunch" ? "bg-green-600" : "bg-gray-600"}
                    text-white text-sm font-medium px-3 py-1 rounded-full`}
                  >
                    {selectedNews.source}
                  </div>
                  <span className="text-gray-500">{selectedNews.date}</span>
                  {selectedNews.verified && (
                    <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200 flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Verified ({selectedNews.confidence}% confidence)
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">{selectedNews.title}</h1>
                
                {/* Large featured image with refined styling */}
                <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-[16/9] relative">
                    <img 
                      src={selectedNews.imageUrl} 
                      alt={selectedNews.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Article content with improved typography */}
                <div className="prose prose-lg max-w-none mb-12">
                  {selectedNews.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
                
                {/* TrueLens AI Analysis section - Improved with Apple-like attention to detail */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md mr-4">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V12M12 8H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">TrueLens AI Analysis</h2>
                  </div>
                  
                  <div className="space-y-8">
                    {/* AI Summary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Summary</h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{selectedNews.aiSummary}</p>
                    </div>
                    
                    {/* Market sentiment */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Market Sentiment</h3>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getSentimentColor(selectedNews.sentiment)}`}>
                        {getSentimentIcon(selectedNews.sentiment)}
                        {selectedNews.sentiment.charAt(0).toUpperCase() + selectedNews.sentiment.slice(1)}
                      </div>
                    </div>
                    
                    {/* Trading insights */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Trading Insights</h3>
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                        <p className="text-gray-700">{selectedNews.tradingInsights}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add IPFS Integration visualization */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md mr-4">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12L12 17L3 12M21 16L12 21L3 16M21 8L12 13L3 8L12 3L21 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">IPFS Verification</h2>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Content Hash (CID)</div>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-3 md:mb-0 overflow-x-auto">
                          QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX
                        </div>
                      </div>
                      <div className="md:pl-4 flex md:flex-col space-x-3 md:space-x-0 md:space-y-2">
                        <a 
                          href="#" 
                          className="text-xs bg-cyan-600 text-white px-3 py-1 rounded-full inline-flex items-center hover:bg-cyan-700 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View on IPFS
                        </a>
                        <a 
                          href="#" 
                          className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full inline-flex items-center hover:bg-gray-300 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12H15M12 9V15M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Details
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm font-medium text-gray-800 mb-1">Archive Date</div>
                      <div className="text-sm text-gray-600">May 15, 2023 - 14:32 UTC</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm font-medium text-gray-800 mb-1">Verification Count</div>
                      <div className="text-sm text-gray-600">87 verifications</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm font-medium text-gray-800 mb-1">Smart Contract</div>
                      <div className="text-sm font-mono text-gray-600 truncate">0x742...7a31</div>
                    </div>
                  </div>
                </div>
                
                {/* Source logos */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Verified Sources</h2>
                  
                  <div className="flex flex-wrap gap-8 justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 p-2 flex items-center justify-center mb-2">
                        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005V3.00005Z" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600">X (Twitter)</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 p-2 flex items-center justify-center mb-2">
                        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#FF0000" />
                          <path d="M19.615 6.184c-.888-.888-2.517-1.184-5.565-1.184H9.949c-3.05 0-4.677.296-5.565 1.184C3.5 7.072 3.2 8.699 3.2 11.75v.5c0 3.05.296 4.677 1.184 5.565.888.888 2.517 1.184 5.565 1.184h4.101c3.05 0 4.677-.296 5.565-1.184.888-.888 1.184-2.517 1.184-5.565v-.5c0-3.05-.296-4.677-1.184-5.565zM9.75 8.75l6.5 3-6.5 3v-6z" fill="white"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600">YouTube</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 p-2 flex items-center justify-center mb-2">
                        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#447BBF" />
                          <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600">TruthSocial</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 p-2 flex items-center justify-center mb-2">
                        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#003D6E" />
                          <path d="M12.295 4H16V12.846C16 16.196 13.56 17 10.52 17C7.435 17 5 16.188 5 12.846V4H8.706V12.604C8.706 14.119 9.245 14.853 10.52 14.853C11.795 14.853 12.295 14.119 12.295 12.604V4Z" fill="white"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600">Reuters</span>
                    </div>
                  </div>
                </div>
                
                {/* Market Sentiment Analysis */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Sentiment Analysis</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">3-Day Sentiment</h3>
                      <div className="flex items-center mb-2">
                        <div className="text-xl font-bold text-gray-900 mr-2">Bullish</div>
                        <div className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Bearish</span>
                        <span>Bullish</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">7-Day Sentiment</h3>
                      <div className="flex items-center mb-2">
                        <div className="text-xl font-bold text-gray-900 mr-2">Neutral</div>
                        <div className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+2%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Bearish</span>
                        <span>Bullish</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">30-Day Sentiment</h3>
                      <div className="flex items-center mb-2">
                        <div className="text-xl font-bold text-gray-900 mr-2">Bearish</div>
                        <div className="text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-8%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '38%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Bearish</span>
                        <span>Bullish</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Market Trends</h3>
                    <p className="text-gray-700 mb-4">
                      Market sentiment has been showing recovery over the past 3 days, shifting from bearish to bullish following recent positive economic developments and policy announcements. Short-term sentiment indicators suggest growing optimism among traders.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        VIX down 3.2%
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        BTC dominance up 1.4%
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                        Tech sector leading
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                        Gold stable
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Trading Suggestions */}
                <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-2xl p-8 mb-12 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/15 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold">Trading Suggestions</h2>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Based on the verified news and current market sentiment, our AI suggests the following trading opportunities:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">Retail Sector ETFs</h3>
                        <div className="bg-green-700 text-white text-xs font-medium px-2 py-0.5 rounded">Buy</div>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">
                        Tax cuts likely to boost consumer spending. Consider retail-focused ETFs for exposure to potential sector growth.
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="flex items-center mr-3">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Medium Risk
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 13.2539C20.3647 14.5196 19.428 15.6258 18.278 16.4826C17.128 17.3394 15.7974 17.9285 14.3846 18.2018C12.9718 18.4751 11.5146 18.4249 10.1258 18.0556C8.73711 17.6862 7.45561 17.0084 6.37997 16.0777C5.30432 15.1469 4.46013 13.9877 3.9136 12.6834C3.36707 11.3791 3.13343 9.96461 3.23092 8.55372C3.32841 7.14283 3.75453 5.7761 4.4722 4.56224C5.18987 3.34837 6.17723 2.31384 7.355 1.53906" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 5L12 14L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          84% Confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">Technology Growth Stocks</h3>
                        <div className="bg-green-700 text-white text-xs font-medium px-2 py-0.5 rounded">Buy</div>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">
                        Tax reform likely to increase corporate reinvestment in R&D. Focus on companies with strong innovation pipelines.
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="flex items-center mr-3">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          High Risk
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 13.2539C20.3647 14.5196 19.428 15.6258 18.278 16.4826C17.128 17.3394 15.7974 17.9285 14.3846 18.2018C12.9718 18.4751 11.5146 18.4249 10.1258 18.0556C8.73711 17.6862 7.45561 17.0084 6.37997 16.0777C5.30432 15.1469 4.46013 13.9877 3.9136 12.6834C3.36707 11.3791 3.13343 9.96461 3.23092 8.55372C3.32841 7.14283 3.75453 5.7761 4.4722 4.56224C5.18987 3.34837 6.17723 2.31384 7.355 1.53906" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 5L12 14L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          76% Confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">Bitcoin & Large-Cap Crypto</h3>
                        <div className="bg-yellow-600 text-white text-xs font-medium px-2 py-0.5 rounded">Hold</div>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">
                        Favorable tax treatment may increase institutional interest, but watch for regulatory developments in the coming weeks.
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="flex items-center mr-3">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Very High Risk
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 13.2539C20.3647 14.5196 19.428 15.6258 18.278 16.4826C17.128 17.3394 15.7974 17.9285 14.3846 18.2018C12.9718 18.4751 11.5146 18.4249 10.1258 18.0556C8.73711 17.6862 7.45561 17.0084 6.37997 16.0777C5.30432 15.1469 4.46013 13.9877 3.9136 12.6834C3.36707 11.3791 3.13343 9.96461 3.23092 8.55372C3.32841 7.14283 3.75453 5.7761 4.4722 4.56224C5.18987 3.34837 6.17723 2.31384 7.355 1.53906" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 5L12 14L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          65% Confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">Financial Services ETFs</h3>
                        <div className="bg-red-700 text-white text-xs font-medium px-2 py-0.5 rounded">Sell</div>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">
                        Tax policy changes may reduce certain fee-based revenue streams in the short term for traditional financial institutions.
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="flex items-center mr-3">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Low Risk
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 13.2539C20.3647 14.5196 19.428 15.6258 18.278 16.4826C17.128 17.3394 15.7974 17.9285 14.3846 18.2018C12.9718 18.4751 11.5146 18.4249 10.1258 18.0556C8.73711 17.6862 7.45561 17.0084 6.37997 16.0777C5.30432 15.1469 4.46013 13.9877 3.9136 12.6834C3.36707 11.3791 3.13343 9.96461 3.23092 8.55372C3.32841 7.14283 3.75453 5.7761 4.4722 4.56224C5.18987 3.34837 6.17723 2.31384 7.355 1.53906" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 5L12 14L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          70% Confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-xs text-gray-400 text-center">
                    <p>These suggestions are for informational purposes only and do not constitute financial advice. Always do your own research before making investment decisions.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center p-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6m2 6V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h9a2 2 0 002-2zm-9-9h4m-4 3h2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Select a news article</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Choose an article from the list to view its content and analysis</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 