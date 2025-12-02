'use client'

import { Product } from '@/types/product'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Package, Calendar, Download, Eye } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const router = useRouter()

  const downloadQRCode = (product: Product) => {
    if (product.qrCode) {
      const link = document.createElement('a')
      link.href = product.qrCode
      link.download = `${product.name}_QR_Code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const viewProductDetails = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  if (products.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Product Database
          </CardTitle>
          <CardDescription>
            All generated products will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products yet</h3>
            <p className="text-gray-500">Create your first product to see it listed here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Product Database ({products.length} products)
          </CardTitle>
          <CardDescription>
            Manage and view all your generated product QR codes
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(product.createdAt)}</span>
              </div>
              
              <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                ID: {product.id}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewProductDetails(product)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => downloadQRCode(product)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedProduct.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  {selectedProduct.qrCode && (
                    <div className="text-center">
                      <img
                        src={selectedProduct.qrCode}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto border rounded-lg"
                      />
                      <Button
                        onClick={() => downloadQRCode(selectedProduct)}
                        className="mt-2 w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Product ID:</span>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                      {selectedProduct.id}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span>
                    <p className="mt-1">{formatDate(selectedProduct.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
