"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NewsCard from "../marketplace/news-card";

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
    <div className="w-full h-full flex flex-col">
      {/* Hero section with title and description */}
      <div className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Verified News Feed</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Authentic news from verified sources to help you make better trading decisions.
          </p>
        </div>
      </div>
      
      {/* News feed layout */}
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-16rem)] bg-gray-50">
        {/* News items sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold">Latest News</h2>
            <p className="text-sm text-gray-500">Verified by TrueLens</p>
          </div>
          
          {isLoading ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : (
            <motion.div 
              className="p-4 space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {newsItems.map((news, index) => (
                <motion.div 
                  key={news.id}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedNews?.id === news.id ? 'border-black shadow-md' : 'border-transparent hover:border-gray-200'}`}
                  onClick={() => handleSelectNews(news)}
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <div className="relative h-24">
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Source badge */}
                      <div className="absolute bottom-2 left-2 flex items-center">
                        <div className={`
                          ${news.source === "Reuters" ? "bg-blue-600" : 
                            news.source === "The Guardian" ? "bg-purple-600" : 
                            news.source === "CoinDesk" ? "bg-yellow-600" : 
                            news.source === "Bloomberg" ? "bg-red-600" : "bg-gray-600"}
                          text-white text-xs font-medium px-2 py-0.5 rounded-sm`}
                        >
                          {news.source}
                        </div>
                      </div>
                      
                      {/* Verification badge */}
                      {news.verified && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm flex items-center">
                            <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Verified
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{news.title}</h3>
                      <p className="text-xs text-gray-500">{news.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Content viewer */}
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto bg-gray-50">
          <AnimatePresence mode="wait">
            {selectedNews ? (
              <motion.div
                key={selectedNews.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto p-6 md:p-10"
              >
                {/* Header with source and date */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`
                    ${selectedNews.source === "Reuters" ? "bg-blue-600" : 
                      selectedNews.source === "The Guardian" ? "bg-purple-600" : 
                      selectedNews.source === "CoinDesk" ? "bg-yellow-600" : 
                      selectedNews.source === "Bloomberg" ? "bg-red-600" : "bg-gray-600"}
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
                
                {/* Title and image */}
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedNews.title}</h1>
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={selectedNews.imageUrl} 
                    alt={selectedNews.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Article content */}
                <div className="prose prose-lg max-w-none mb-10">
                  {selectedNews.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                {/* TrueLens AI Analysis section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                    <svg className="w-6 h-6 mr-2 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V12M12 8H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    TrueLens AI Analysis
                  </h2>
                  
                  <div className="space-y-6">
                    {/* AI Summary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Summary</h3>
                      <p className="text-gray-700">{selectedNews.aiSummary}</p>
                    </div>
                    
                    {/* Market sentiment */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Market Sentiment</h3>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getSentimentColor(selectedNews.sentiment)}`}>
                        {getSentimentIcon(selectedNews.sentiment)}
                        {selectedNews.sentiment.charAt(0).toUpperCase() + selectedNews.sentiment.slice(1)}
                      </div>
                    </div>
                    
                    {/* Trading insights */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Trading Insights</h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700">{selectedNews.tradingInsights}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sources and verification */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Verification Sources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">{selectedNews.source}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">TruthSocial</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">X (Twitter)</span>
                    </div>
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
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6m2 6V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h9a2 2 0 002-2zm-9-9h4m-4 3h2" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Select a news article</h3>
                  <p className="text-gray-500">Choose an article from the list to view its content and analysis</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 