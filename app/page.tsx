'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import { supabaseService } from '@/lib/supabase-service'
import ProductForm from '@/components/ProductForm'
import ProductList from '@/components/ProductList'
import { Button } from '@/components/ui/button'
import { QrCode, Package, Plus } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<'generator' | 'products'>('generator')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await supabaseService.getProducts()
        if (result.success && result.data) {
          setProducts(result.data)
        } else {
          console.error('Failed to load products:', result.error)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadProducts()
  }, [])

  const handleProductCreated = (product: Product) => {
    setProducts(prev => [product, ...prev])
    setActiveTab('products')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <QrCode className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Product QR Code Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create QR codes for your products and manage your product database with ease. 
            Generate unique identifiers and track all your products in one place.
          </p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={activeTab === 'generator' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('generator')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Generate QR Code
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('products')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Product Database
              {products.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {products.length}
                </span>
              )}
            </Button>
          </div>
        </nav>

        <main>
          {activeTab === 'generator' ? (
            <div className="flex justify-center">
              <ProductForm onProductCreated={handleProductCreated} />
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 Product QR Code Generator. Built with Next.js and React.</p>
        </footer>
      </div>
    </div>
  )
}
