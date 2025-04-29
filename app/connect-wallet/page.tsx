"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Loader2 } from "lucide-react"

export default function ConnectWalletPage() {
  const router = useRouter()
  const { connectWallet, isConnected, isLoading } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const wallets = [
    { id: "nami", name: "Nami Wallet", logo: "N" },
    { id: "eternl", name: "Eternl Wallet", logo: "E" },
    { id: "lace", name: "Lace Wallet", logo: "L" },
  ]

  const handleConnect = async () => {
    if (!selectedWallet) return

    await connectWallet(selectedWallet)
    router.push("/dashboard")
  }

  // If already connected, redirect to dashboard
  if (isConnected && !isLoading) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>Connect your Cardano wallet to access the AgriTraceChain platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {wallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant={selectedWallet === wallet.id ? "default" : "outline"}
                className="flex justify-start h-16"
                onClick={() => setSelectedWallet(wallet.id)}
              >
                <div className="flex items-center w-full gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {wallet.logo}
                  </div>
                  <div className="font-medium">{wallet.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleConnect} disabled={!selectedWallet || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
