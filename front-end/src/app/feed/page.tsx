"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatDate, truncateText } from "@/lib/utils";

// Mock data for news items
const mockNews = [
  {
    id: 1,
    title: "Trump Administration Announces New Tariffs on Chinese Goods",
    description: "The Trump administration has announced a new 15% tariff on $300 billion worth of Chinese imports, escalating the ongoing trade war between the two countries.",
    image: "/news/tariffs.jpg",
    source: "Financial Times",
    verified: true,
    date: "2023-08-15T12:30:00Z",
    content: `
      <p>In a move that has rattled global markets, the Trump administration announced on Wednesday that it would impose a 15% tariff on $300 billion worth of Chinese imports starting next month.</p>
      <p>The decision comes amid stalled trade talks between the world's two largest economies and marks a significant escalation in the trade war that has been ongoing since 2018.</p>
      <p>"We're doing this for the American economy, the American people, and the American worker," said President Trump in a statement. "China has been taking advantage of the United States for far too long, and we're putting a stop to it."</p>
      <p>The new tariffs will affect a wide range of consumer goods, including electronics, clothing, and toys, potentially leading to higher prices for American consumers ahead of the holiday shopping season.</p>
      <p>Chinese officials have responded by threatening to impose countermeasures, raising concerns about further economic disruption in an already uncertain global environment.</p>
      <p>Market analysts are closely watching the situation, with many predicting increased volatility in both equity and currency markets in the coming weeks.</p>
    `,
    aiSummary: "The Trump administration has announced a 15% tariff on $300 billion of Chinese imports, escalating the US-China trade war. This move is likely to increase consumer prices in the US and could lead to retaliatory measures from China. Markets are expected to remain volatile in response.",
    tradingImplications: "This development could negatively impact US retailers and consumer goods companies that rely heavily on Chinese imports. Consider adjusting positions in these sectors. The uncertainty may also drive safe-haven asset flows to gold and US Treasuries."
  },
  {
    id: 2,
    title: "Federal Reserve Signals Possible Interest Rate Cut",
    description: "Federal Reserve Chairman Jerome Powell has indicated that the central bank may be prepared to cut interest rates in response to growing economic uncertainties.",
    image: "/news/fed.jpg",
    source: "The Wall Street Journal",
    verified: true,
    date: "2023-08-14T15:45:00Z",
    content: `
      <p>Federal Reserve Chairman Jerome Powell has signaled that the central bank may be prepared to cut interest rates in the near future, responding to mounting economic pressures and ongoing trade tensions.</p>
      <p>Speaking at the annual economic symposium in Jackson Hole, Wyoming, Powell noted that while the U.S. economy remains strong, "crosscurrents" including trade policy uncertainty and global growth concerns could warrant preventative measures.</p>
      <p>"We will act as appropriate to sustain the expansion," Powell said, a phrase he has used previously when signaling rate cuts.</p>
      <p>The remarks come as President Trump has repeatedly criticized the Fed and Powell personally for not cutting rates more aggressively, arguing that higher rates put the U.S. at a disadvantage compared to other countries.</p>
      <p>Market participants now see a greater than 95% probability of a rate cut at the Fed's September meeting, according to CME Group's FedWatch tool.</p>
      <p>Some economists warn, however, that the Fed may be using up limited ammunition that could be needed if a more serious economic downturn occurs in the future.</p>
    `,
    aiSummary: "Fed Chairman Jerome Powell has indicated a potential interest rate cut is coming, citing trade tensions and global growth concerns despite the overall strength of the US economy. Markets are now pricing in a >95% chance of a September rate cut.",
    tradingImplications: "This dovish shift could benefit growth stocks, particularly in technology. Bond prices may rise (yields fall) in anticipation of lower rates. The banking sector might face pressure due to compressed net interest margins."
  },
  {
    id: 3,
    title: "Bitcoin Surges Past $45,000 on Institutional Adoption News",
    description: "Bitcoin has broken through the $45,000 barrier following announcements from several major financial institutions about new cryptocurrency offerings.",
    image: "/news/bitcoin.jpg",
    source: "CoinDesk, Bloomberg",
    verified: true,
    date: "2023-08-13T08:20:00Z",
    content: `
      <p>Bitcoin surged past $45,000 on Thursday, reaching its highest level in four months, as a wave of institutional adoption continues to fuel the cryptocurrency market.</p>
      <p>The rally comes after Morgan Stanley announced it would be offering wealthy clients access to three funds that enable Bitcoin ownership, following similar moves by other major financial institutions including BNY Mellon and BlackRock.</p>
      <p>"This is further evidence that cryptocurrencies, and Bitcoin in particular, are gaining mainstream acceptance in the financial world," said cryptocurrency analyst Sarah Chen. "Institutional adoption was always seen as a key milestone for the maturation of the crypto market."</p>
      <p>The move also coincides with growing concerns about inflation following unprecedented stimulus measures from governments worldwide in response to the pandemic.</p>
      <p>"Many investors are turning to Bitcoin as a potential hedge against currency devaluation and inflation," noted economic historian Peter Grant. "The limited supply of Bitcoin makes it attractive in an environment where fiat currency is being created at record rates."</p>
      <p>However, regulators continue to express caution. SEC Commissioner Gary Gensler recently emphasized the need for stronger investor protections in cryptocurrency markets, suggesting that increased regulation may be forthcoming.</p>
    `,
    aiSummary: "Bitcoin has broken above $45,000 following announcements of new crypto offerings from major financial institutions like Morgan Stanley. This institutional adoption, combined with inflation concerns, is driving the current rally.",
    tradingImplications: "The institutional adoption trend suggests a potential long-term structural bull case for Bitcoin and possibly other established cryptocurrencies. Companies with significant Bitcoin holdings or mining operations might see positive price action in correlation."
  },
];

export default function FeedPage() {
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(0);
  const selectedNews = mockNews[selectedNewsIndex];

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <div className="flex flex-col md:flex-row flex-1">
        {/* News List (Left Side) */}
        <div className="w-full md:w-2/5 lg:w-1/3 border-r bg-muted/10 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Latest Verified News</h2>
            <p className="text-muted-foreground text-sm">Stay informed with trusted sources</p>
          </div>
          
          <div className="divide-y">
            {mockNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/20 transition-colors",
                  selectedNewsIndex === index && "bg-muted/30"
                )}
                onClick={() => setSelectedNewsIndex(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-1" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium line-clamp-2">{news.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{truncateText(news.description, 70)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{news.source}</span>
                      <div className="flex items-center gap-1">
                        {news.verified && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span className="text-xs">{formatDate(news.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* News Content (Right Side) */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <motion.div
            key={selectedNews.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto p-6 md:p-8"
          >
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{selectedNews.title}</h1>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedNews.source}</span>
                  {selectedNews.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(selectedNews.date)}</span>
              </div>
              
              <div className="relative h-48 sm:h-64 md:h-80 w-full mb-6 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div 
                className="prose prose-sm sm:prose max-w-none mb-10" 
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              />
            </div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="font-semibold">AI Summary</h3>
                </div>
                <p className="text-sm">{selectedNews.aiSummary}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <h3 className="font-semibold text-blue-700">Trading Implications</h3>
                </div>
                <p className="text-sm text-blue-700">{selectedNews.tradingImplications}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="font-semibold">Verified Sources</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNews.source.split(', ').map((source, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-card text-xs rounded-md border"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 