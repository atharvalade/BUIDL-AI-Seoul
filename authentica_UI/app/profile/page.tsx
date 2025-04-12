"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Mock data
const USER_DATA = {
  address: "0x89...1e46",
  level: 4,
  pointsEarned: 1425,
  pointsToNextLevel: 575,
  totalVerified: 87,
  accuracy: 94.3,
  tokens: 275.6,
  recent: [
    {
      id: "1",
      title: "Trump Administration Announces New Tax Cuts for Businesses",
      source: "Reuters",
      date: "2 hours ago",
      verified: true,
      points: 35,
      accuracy: 97,
    },
    {
      id: "2",
      title: "Federal Reserve Signals Possible Interest Rate Hike",
      source: "The Guardian",
      date: "6 hours ago",
      verified: true,
      points: 28,
      accuracy: 92,
    },
    {
      id: "3",
      title: "Major Cryptocurrency Exchange Announces New Regulatory Compliance Measures",
      source: "CoinDesk",
      date: "1 day ago",
      verified: false,
      points: 0,
      accuracy: 68,
    }
  ]
};

const LEADERBOARD = [
  { address: "0x93...7f82", level: 12, verified: 342, tokens: 1240.5 },
  { address: "0x45...9c21", level: 10, verified: 287, tokens: 875.2 },
  { address: "0x72...3e56", level: 9, verified: 251, tokens: 810.7 },
  { address: "0x89...1e46", level: 4, verified: 87, tokens: 275.6 }, // Current user
  { address: "0xab...4d23", level: 3, verified: 62, tokens: 184.3 },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Simulate loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Profile Header */}
      <div className="w-full bg-[#0F172A] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold">{USER_DATA.address}</h1>
                    <div className="ml-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full px-3 py-1 text-xs font-medium">
                      Level {USER_DATA.level}
                    </div>
                  </div>
                  <p className="text-gray-300 mt-1">Verification Accuracy: {USER_DATA.accuracy}%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{USER_DATA.tokens}</div>
                <div className="text-xs text-gray-300">TRUE Tokens</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{USER_DATA.totalVerified}</div>
                <div className="text-xs text-gray-300">News Verified</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center md:col-span-1 col-span-2">
                <div className="text-2xl font-bold">{USER_DATA.pointsEarned}</div>
                <div className="text-xs text-gray-300">Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                activeTab === "dashboard"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("verifications")}
              className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                activeTab === "verifications"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Verifications
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                activeTab === "leaderboard"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                activeTab === "settings"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {activeTab === "dashboard" && (
          <div className="space-y-10">
            {/* Progress to next level */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Level Progress</h2>
              <div className="mb-2 flex justify-between">
                <span className="text-gray-700">Level {USER_DATA.level}</span>
                <span className="text-gray-700">Level {USER_DATA.level + 1}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full" 
                  style={{width: `${(USER_DATA.pointsEarned / (USER_DATA.pointsEarned + USER_DATA.pointsToNextLevel)) * 100}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {USER_DATA.pointsToNextLevel} more points needed to reach Level {USER_DATA.level + 1}
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Level Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">+{USER_DATA.level * 3} TRUE tokens per verification</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">+{USER_DATA.level * 2}% voting weight in community</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Access to {USER_DATA.level <= 3 ? 'standard' : 'premium'} verification requests</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Next Level Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">+{(USER_DATA.level + 1) * 3} TRUE tokens per verification</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">+{(USER_DATA.level + 1) * 2}% voting weight in community</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Access to {USER_DATA.level + 1 <= 3 ? 'standard' : 'premium'} verification requests</span>
                    </li>
                    {USER_DATA.level + 1 >= 5 && (
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Ability to propose new sources for verification</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Recent activity */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Verifications</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View All
                </button>
              </div>
              
              <div className="overflow-hidden">
                <div className="flex flex-col divide-y divide-gray-200">
                  {USER_DATA.recent.map((item) => (
                    <div key={item.id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center mb-1">
                            <div className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${
                              item.source === "Reuters" ? "bg-blue-600 text-white" : 
                              item.source === "The Guardian" ? "bg-purple-600 text-white" : 
                              "bg-yellow-600 text-white"
                            }`}>
                              {item.source}
                            </div>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{item.title}</p>
                          
                          <div className="flex items-center mt-2">
                            {item.verified ? (
                              <>
                                <span className="inline-flex items-center text-xs text-green-700 bg-green-50 rounded-full px-2 py-0.5 border border-green-200">
                                  <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Verified
                                </span>
                                <span className="text-xs text-gray-500 ml-2">Accuracy: {item.accuracy}%</span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center text-xs text-red-700 bg-red-50 rounded-full px-2 py-0.5 border border-red-200">
                                  <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  Not Verified
                                </span>
                                <span className="text-xs text-gray-500 ml-2">Accuracy: {item.accuracy}%</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {item.verified && (
                          <div className="text-right">
                            <div className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full px-3 py-1">
                              <svg className="w-3 h-3 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              +{item.points} points
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "leaderboard" && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Verifiers</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      News Verified
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TRUE Tokens
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {LEADERBOARD.map((user, index) => (
                    <tr 
                      key={user.address} 
                      className={user.address === USER_DATA.address ? "bg-indigo-50" : (index % 2 === 0 ? "bg-white" : "bg-gray-50")}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          {user.address === USER_DATA.address ? (
                            <>
                              <span className="font-medium">{user.address}</span>
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                You
                              </span>
                            </>
                          ) : (
                            <span>{user.address}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Level {user.level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.verified}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.tokens}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === "verifications" && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">News Pending Verification</h2>
            
            <div className="space-y-6">
              {/* Mock pending verification items */}
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${
                          index === 0 ? "bg-blue-600 text-white" : 
                          index === 1 ? "bg-purple-600 text-white" : 
                          "bg-red-600 text-white"
                        }`}>
                          {index === 0 ? "Reuters" : index === 1 ? "The Guardian" : "Bloomberg"}
                        </div>
                        <span className="text-xs text-gray-500">{index === 0 ? "1 hour ago" : index === 1 ? "3 hours ago" : "5 hours ago"}</span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {index === 0 ? "Senate Approves New Infrastructure Bill" : 
                         index === 1 ? "Tech Company Announces Major Acquisition" : 
                         "Central Bank Discusses Future Monetary Policy"}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {index === 0 ? "The Senate has approved a $1.2 trillion infrastructure bill that aims to rebuild roads and bridges..." : 
                         index === 1 ? "A major technology company has announced plans to acquire a software firm specializing in AI..." : 
                         "Central bank officials discussed potential changes to monetary policy in their latest meeting..."}
                      </p>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <div className="flex items-center mr-4">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          {index === 0 ? "42 verifications" : index === 1 ? "28 verifications" : "15 verifications"}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          {index === 0 ? "76% verified" : index === 1 ? "54% verified" : "42% verified"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <button className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verify (+25 pts)
                      </button>
                      <button className="inline-flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Flag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "settings" && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personalization Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">News Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">News Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {["Politics", "Economy", "Cryptocurrency", "Stock Market", "Technology", "Business", "International"].map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            id={`category-${category}`}
                            name={`category-${category}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked={["Economy", "Cryptocurrency", "Stock Market"].includes(category)}
                          />
                          <label htmlFor={`category-${category}`} className="ml-2 mr-4 text-sm text-gray-700">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Sources</label>
                    <div className="flex flex-wrap gap-2">
                      {["Reuters", "Bloomberg", "The Guardian", "TruthSocial", "X (Twitter)", "YouTube", "CNBC", "Wall Street Journal"].map((source) => (
                        <div key={source} className="flex items-center">
                          <input
                            id={`source-${source}`}
                            name={`source-${source}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked={["Reuters", "Bloomberg", "TruthSocial", "X (Twitter)"].includes(source)}
                          />
                          <label htmlFor={`source-${source}`} className="ml-2 mr-4 text-sm text-gray-700">
                            {source}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trading Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Settings</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="notifications-verified"
                          name="notifications-verified"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notifications-verified" className="ml-2 text-sm text-gray-700">
                          Notify me about highly verified news (&gt;90% verification)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifications-trading"
                          name="notifications-trading"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notifications-trading" className="ml-2 text-sm text-gray-700">
                          Notify me about trading suggestions based on verified news
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifications-sentiment"
                          name="notifications-sentiment"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notifications-sentiment" className="ml-2 text-sm text-gray-700">
                          Notify me about significant market sentiment changes
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trading Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {["Stocks", "Cryptocurrencies", "ETFs", "Forex", "Commodities", "Options"].map((interest) => (
                        <div key={interest} className="flex items-center">
                          <input
                            id={`interest-${interest}`}
                            name={`interest-${interest}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked={["Stocks", "Cryptocurrencies"].includes(interest)}
                          />
                          <label htmlFor={`interest-${interest}`} className="ml-2 mr-4 text-sm text-gray-700">
                            {interest}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 