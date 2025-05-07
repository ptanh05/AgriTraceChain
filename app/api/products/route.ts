import { NextResponse } from "next/server"
import connectMongo from "@/configs/mongoConfig"
import Product from "@/models/Product"

let products: any[] = []

export async function GET(request: Request) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const ownerAddress = searchParams.get('ownerAddress');

  const products = await Product.find({ owner: ownerAddress });
  return NextResponse.json(products);
}

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const productData = await request.json()

    // In a real implementation, this would validate the data and interact with the blockchain
    // For demo purposes, we'll just generate an ID and return the product
    const newProduct = {
      id: `${products.length + 1}`,
      ...productData,
      status: "Active",
      txHash: `tx_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      blockHeight: `${Math.floor(Math.random() * 1000000) + 8000000}`,
      timestamp: new Date().toISOString(),
      farmer: {
        name: productData.farmerName || "Anonymous Farmer",
        address: productData.farmerAddress || "addr1q...",
        verified: true,
      },
      transportHistory: [
        {
          date: new Date().toISOString().split("T")[0],
          location: productData.location,
          status: "Registered",
          handler: productData.farmerName || "Anonymous Farmer",
          txHash: `tx_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
        },
      ],
    }

    // In a real implementation, we would add the product to the database
    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
