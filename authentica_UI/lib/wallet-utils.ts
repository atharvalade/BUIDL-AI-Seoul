// Mock implementation of wallet interactions

// Constants
export const SAGA_CHAINLET_ID = "2744466489002000";
export const ROOTSTOCK_TESTNET_ID = "31";
export const SAGA_POOL_ADDRESS = "0x14effc940Cb4Eac96E70c2D1413369367B89033a";

// Interface representing a transaction
export interface Transaction {
  from: string;
  to: string;
  value: string;
  data: string;
  chainId: string;
}

// Interface for Ethereum provider
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
  selectedAddress?: string;
  chainId?: string;
}

// Add ethereum property to the window type
declare global {
  interface Window {
    ethereum?: EthereumProvider | {
      providers?: EthereumProvider[];
      providerMap?: Map<string, EthereumProvider>;
    };
  }
}

// Get the MetaMask provider specifically
export const getMetaMaskProvider = (): EthereumProvider | null => {
  // Case 1: When MetaMask is the only provider (standard)
  if (typeof window !== 'undefined' && 
      window.ethereum && 
      'isMetaMask' in window.ethereum && 
      window.ethereum.isMetaMask) {
    return window.ethereum as EthereumProvider;
  }

  // Case 2: When there's a providers array (e.g., with Coinbase Wallet + MetaMask)
  if (typeof window !== 'undefined' && 
      window.ethereum && 
      'providers' in window.ethereum && 
      Array.isArray(window.ethereum.providers)) {
    const metaMaskProvider = window.ethereum.providers.find(
      (provider) => provider && 'isMetaMask' in provider && provider.isMetaMask
    );
    if (metaMaskProvider) {
      return metaMaskProvider;
    }
  }
  
  // Case 3: Sometimes MetaMask might be in a providerMap (less common)
  if (typeof window !== 'undefined' && 
      window.ethereum && 
      'providerMap' in window.ethereum && 
      window.ethereum.providerMap instanceof Map) {
    const metaMaskProvider = window.ethereum.providerMap.get('MetaMask');
    if (metaMaskProvider) {
      return metaMaskProvider;
    }
  }

  return null;
};

// Check if MetaMask is available
const hasMetaMask = (): boolean => {
  const provider = getMetaMaskProvider();
  return provider !== null && typeof provider.request === 'function';
};

// Mock function to request wallet connection and get account
export const connectWallet = async (): Promise<string | null> => {
  const metaMaskProvider = getMetaMaskProvider();
  
  if (!metaMaskProvider) {
    console.error("MetaMask not found. Please install the MetaMask extension.");
    alert("MetaMask is not found or not available. Please install the MetaMask extension to use this feature.");
    
    // Open MetaMask installation page
    window.open('https://metamask.io/download/', '_blank');
    return null;
  }
  
  try {
    // Request account access
    const accounts = await metaMaskProvider.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error("User denied account access", error);
    return null;
  }
};

// Mock function to check if the correct network is selected
export const switchToNetwork = async (chainId: string): Promise<boolean> => {
  const metaMaskProvider = getMetaMaskProvider();
  
  if (!metaMaskProvider) {
    console.error("MetaMask not found. Please install the MetaMask extension.");
    alert("MetaMask is not found or not available. Please install the MetaMask extension to use this feature.");
    
    // Open MetaMask installation page
    window.open('https://metamask.io/download/', '_blank');
    return false;
  }
  
  try {
    // Check current chain ID
    const currentChainId = await metaMaskProvider.request({ method: 'eth_chainId' });
    
    // If we're already on the right chain, return
    if (currentChainId === `0x${parseInt(chainId).toString(16)}`) {
      return true;
    }
    
    // Otherwise, request to switch
    await metaMaskProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
    });
    
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        if (chainId === SAGA_CHAINLET_ID) {
          await metaMaskProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(SAGA_CHAINLET_ID).toString(16)}`,
              chainName: 'TrueLens SAGA Chainlet',
              nativeCurrency: {
                name: 'TRUE',
                symbol: 'TRUE',
                decimals: 18
              },
              rpcUrls: ['https://truelens-2744466489002000-1.jsonrpc.sagarpc.io'],
              blockExplorerUrls: ['https://truelens-2744466489002000-1.sagaexplorer.io']
            }]
          });
          return true;
        } else if (chainId === ROOTSTOCK_TESTNET_ID) {
          await metaMaskProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(ROOTSTOCK_TESTNET_ID).toString(16)}`,
              chainName: 'Rootstock Testnet',
              nativeCurrency: {
                name: 'tRBTC',
                symbol: 'tRBTC',
                decimals: 18
              },
              rpcUrls: ['https://public-node.testnet.rsk.co'],
              blockExplorerUrls: ['https://explorer.testnet.rsk.co']
            }]
          });
          return true;
        }
      } catch (addError) {
        console.error("Error adding chain to MetaMask:", addError);
        return false;
      }
    }
    console.error("Error switching network in MetaMask:", error);
    return false;
  }
};

// Mock function to send TRUE tokens for staking
export const stakeTrueTokens = async (amount: number): Promise<{success: boolean, hash?: string}> => {
  const metaMaskProvider = getMetaMaskProvider();
  
  if (!metaMaskProvider) {
    console.error("MetaMask not found. Please install the MetaMask extension.");
    alert("MetaMask is not found or not available. Please install the MetaMask extension to use this feature.");
    
    // Open MetaMask installation page
    window.open('https://metamask.io/download/', '_blank');
    return { success: false };
  }
  
  try {
    // First ensure the correct network is selected
    const networkSwitched = await switchToNetwork(SAGA_CHAINLET_ID);
    if (!networkSwitched) {
      return { success: false };
    }
    
    // Get the current account
    const accounts = await metaMaskProvider.request({ method: 'eth_accounts' });
    const from = accounts[0];
    
    if (!from) {
      console.error("No account connected in MetaMask");
      return { success: false };
    }
    
    // Format amount to wei (assuming 18 decimals)
    const amountInWei = `0x${(amount * 10**18).toString(16)}`;
    
    // Create transaction parameters
    const txParams = {
      from,
      to: SAGA_POOL_ADDRESS,
      value: amountInWei,
      // In a real implementation, we'd include contract data for an ERC20 transfer
      data: '0x', 
    };
    
    // Send transaction
    const txHash = await metaMaskProvider.request({
      method: 'eth_sendTransaction',
      params: [txParams],
    });
    
    return { success: true, hash: txHash };
  } catch (error) {
    console.error("Error staking tokens using MetaMask:", error);
    return { success: false };
  }
};

// Mock function to sign data on Rootstock
export const signVerificationOnRootstock = async (
  newsId: number,
  choice: 'verify' | 'flag',
  newsDetails?: {
    title?: string;
    source?: string;
    date?: string;
    summary?: string;
    ipfsHash?: string;
  }
): Promise<{success: boolean, hash?: string}> => {
  const metaMaskProvider = getMetaMaskProvider();
  
  if (!metaMaskProvider) {
    console.error("MetaMask not found. Please install the MetaMask extension.");
    alert("MetaMask is not found or not available. Please install the MetaMask extension to use this feature.");
    
    // Open MetaMask installation page
    window.open('https://metamask.io/download/', '_blank');
    return { success: false };
  }
  
  try {
    // First switch to Rootstock network
    const networkSwitched = await switchToNetwork(ROOTSTOCK_TESTNET_ID);
    if (!networkSwitched) {
      return { success: false };
    }
    
    // Get the current account
    const accounts = await metaMaskProvider.request({ method: 'eth_accounts' });
    const account = accounts[0];
    
    if (!account) {
      console.error("No account connected in MetaMask");
      return { success: false };
    }
    
    // Create message to sign with enhanced details
    const message = JSON.stringify({
      action: choice,
      newsId,
      title: newsDetails?.title || "Unknown News Title",
      source: newsDetails?.source || "Unknown Source",
      date: newsDetails?.date || new Date().toISOString(),
      summary: newsDetails?.summary ? (newsDetails.summary.length > 100 ? 
               newsDetails.summary.substring(0, 97) + '...' : newsDetails.summary) : 
               "No summary available",
      ipfsHash: newsDetails?.ipfsHash || "",
      timestamp: Date.now(),
      network: "rootstock_testnet",
      verifierAddress: account,
      stake: "10 TRUE tokens"
    }, null, 2); // Pretty print the JSON for better readability
    
    // Sign the message
    const signature = await metaMaskProvider.request({
      method: 'personal_sign',
      params: [message, account],
    });
    
    // In a real implementation, we'd create and send a transaction
    // For mock purposes, we'll just simulate it
    // Generate a fake transaction hash
    const txHash = `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    return { success: true, hash: txHash };
  } catch (error) {
    console.error("Error signing verification on Rootstock using MetaMask:", error);
    return { success: false };
  }
};

// Mock implementation for checking if MetaMask is connected
export const isWalletConnected = async (): Promise<boolean> => {
  const metaMaskProvider = getMetaMaskProvider();
  
  if (!metaMaskProvider) {
    return false;
  }
  
  try {
    const accounts = await metaMaskProvider.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    console.error("Error checking MetaMask connection:", error);
    return false;
  }
}; 