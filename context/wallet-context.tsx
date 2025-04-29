"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type WalletContextType = {
  walletAddress: string | null
  isConnected: boolean
  walletType: string | null
  balance: number | null
  connectWallet: (walletType: string) => Promise<void>
  disconnectWallet: () => void
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if wallet is already connected on page load
  useEffect(() => {
    const savedWalletType = localStorage.getItem("walletType")
    const savedWalletAddress = localStorage.getItem("walletAddress")

    if (savedWalletType && savedWalletAddress) {
      setWalletType(savedWalletType)
      setWalletAddress(savedWalletAddress)
      // In a real implementation, we would verify the connection is still valid
      // and fetch the current balance
      setBalance(Math.random() * 1000) // Mock balance for demo
    }
  }, [])

  const connectWallet = async (type: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would use the actual Cardano wallet APIs
      // For demo purposes, we'll simulate a connection
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      // Generate a mock wallet address based on the wallet type
      const mockAddress = `addr1q${type.toLowerCase()}${Math.random().toString(36).substring(2, 10)}...`

      setWalletAddress(mockAddress)
      setWalletType(type)
      setBalance(Math.random() * 1000) // Mock balance

      // Save to localStorage for persistence
      localStorage.setItem("walletType", type)
      localStorage.setItem("walletAddress", mockAddress)

      // In a real implementation, we would also authenticate with the backend
      // by sending the wallet address and a signed message
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setWalletType(null)
    setBalance(null)
    localStorage.removeItem("walletType")
    localStorage.removeItem("walletAddress")
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected: !!walletAddress,
        walletType,
        balance,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
