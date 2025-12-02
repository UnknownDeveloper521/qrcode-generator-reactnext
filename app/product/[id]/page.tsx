'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import { supabaseService } from '@/lib/supabase-service'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Package, Calendar, QrCode as QrCodeIcon } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError('Product ID not provided')
        setIsLoading(false)
        return
      }

      try {
        const result = await supabaseService.getProduct(productId)
        
        if (result.success && result.data) {
          setProduct(result.data)
        } else {
          setError(result.error || 'Product not found')
        }
      } catch (error) {
        console.error('Error loading product:', error)
        setError('Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const downloadQRCode = () => {
    if (product?.qrCode) {
      const link = document.createElement('a')
      link.href = product.qrCode
      link.download = `${product.name}_QR_Code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Product Not Found</CardTitle>
            <CardDescription>
              {error || 'The requested product could not be found.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created on {formatDate(product.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Product ID</h3>
                  <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono block">
                    {product.id}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Section */}
            {product.qrCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCodeIcon className="h-5 w-5" />
                    QR Code
                  </CardTitle>
                  <CardDescription>
                    Scan this QR code to access this product page
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                    <img
                      src={product.qrCode}
                      alt="Product QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <Button onClick={downloadQRCode} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Product Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="font-semibold text-gray-600">Product ID:</span>
                <p className="mt-1 font-mono text-xs bg-gray-50 p-2 rounded">
                  {product.id}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Created:</span>
                <p className="mt-1">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Status:</span>
                <p className="mt-1 text-green-600 font-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
