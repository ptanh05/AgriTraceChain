import { NextResponse } from "next/server"

// Mock database for products
const products = [
  {
    id: "1",
    name: "Organic Rice",
    type: "Grain",
    quantity: "500 kg",
    unit: "kg",
    location: "Farm A, District B",
    description:
      "Premium organic rice grown without pesticides or chemical fertilizers. Cultivated using traditional farming methods that preserve soil health and biodiversity.",
    harvestDate: "2023-04-10",
    price: "12.50",
    status: "Active",
    txHash: "tx_8f7d6c5e4b3a2c1d",
    blockHeight: "8245671",
    timestamp: "2023-04-15T09:30:45Z",
    farmer: {
      name: "John Smith",
      address: "addr1qxy8e...",
      verified: true,
    },
    certifications: ["Organic", "Pesticide-Free", "Sustainable Farming"],
    transportHistory: [
      {
        date: "2023-04-15",
        location: "Farm A",
        status: "Harvested",
        handler: "John Smith",
        txHash: "tx_8f7d6c5e4b3a2c1d",
      },
      {
        date: "2023-04-18",
        location: "Processing Center",
        status: "Processing",
        handler: "Processing Co.",
        txHash: "tx_7e6d5c4b3a2f1e0d",
      },
      {
        date: "2023-04-22",
        location: "Distribution Center",
        status: "Ready for Distribution",
        handler: "Logistics Inc.",
        txHash: "tx_6f5e4d3c2b1a0z9y",
      },
    ],
  },
  {
    id: "2",
    name: "Fresh Tomatoes",
    type: "Vegetable",
    quantity: "200 kg",
    unit: "kg",
    location: "Farm B, District C",
    description: "Fresh, vine-ripened tomatoes grown using sustainable farming practices.",
    harvestDate: "2023-04-12",
    price: "8.75",
    status: "In Transit",
    txHash: "tx_1a2b3c4d5e6f7g8h",
    blockHeight: "8245612",
    timestamp: "2023-04-12T14:22:33Z",
    farmer: {
      name: "Maria Garcia",
      address: "addr1qab7c...",
      verified: true,
    },
    certifications: ["Organic", "Non-GMO"],
    transportHistory: [
      {
        date: "2023-04-12",
        location: "Farm B",
        status: "Harvested",
        handler: "Maria Garcia",
        txHash: "tx_1a2b3c4d5e6f7g8h",
      },
      {
        date: "2023-04-14",
        location: "Packaging Facility",
        status: "Packaging",
        handler: "Fresh Pack Co.",
        txHash: "tx_2b3c4d5e6f7g8h9i",
      },
    ],
  },
]

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
