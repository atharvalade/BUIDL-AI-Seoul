"use client";

import Link from "next/link";
import Image from "next/image";
import useScroll from "@/lib/hooks/use-scroll";
import { useState } from "react";

export default function NavBar() {
  const scrolled = useScroll(50);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Mock connecting to MetaMask
  const connectWallet = async () => {
    setConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      setWalletAddress("0x89...1e46"); // Mock address
    }, 1500);
  };

  return (
    <>
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/40 backdrop-blur-md"
            : "bg-transparent"
        } z-30 transition-all duration-300`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center mt-1 relative">
            <div className="relative w-[240px] h-[50px]">
              <object 
                data={`/TrueLens_Logo.svg?v=${new Date().getTime()}`}
                type="image/svg+xml"
                className="w-full h-full"
                aria-label="TrueLens logo"
              />
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/about"
              className="hidden sm:flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/feed"
              className="hidden sm:flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Your Feed
            </Link>

            {!connected ? (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center justify-center rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-gray-800 hover:bg-white h-[40px] mt-1"
              >
                {connecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30.3618 0H2.63273C1.17991 0 0 1.17991 0 2.63273V22.3782C0 23.831 1.17991 25.0109 2.63273 25.0109H12.4455V29.1945H8.29697V31H24.7077V29.1945H20.5491V25.0109H30.3618C31.8146 25.0109 32.9945 23.831 32.9945 22.3782V2.63273C32.9945 1.17991 31.8146 0 30.3618 0ZM21.3073 29.1945H11.6873V25.0109H21.3073V29.1945ZM31.1891 22.3782C31.1891 22.8346 30.8182 23.2055 30.3618 23.2055H2.63273C2.17634 23.2055 1.80546 22.8346 1.80546 22.3782V21.5182H31.1891V22.3782ZM31.1891 19.7127H1.80546V2.63273C1.80546 2.17634 2.17634 1.80546 2.63273 1.80546H30.3618C30.8182 1.80546 31.1891 2.17634 31.1891 2.63273V19.7127Z" fill="currentColor"/>
                    </svg>
                    Connect Wallet
                  </>
                )}
              </button>
            ) : (
              <Link
                href="/profile"
                className="flex items-center justify-center rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-gray-800 hover:bg-white h-[40px] mt-1"
              >
                <svg className="w-4 h-4 mr-2 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {walletAddress}
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional transparent gradient to help transition */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/90 to-transparent pointer-events-none z-20" />
    </>
  );
}
