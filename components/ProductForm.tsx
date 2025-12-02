'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, QrCode, Calendar } from 'lucide-react'
import { ProductFormData, Product } from '@/types/product'
import { generateProductId, formatDate } from '@/lib/utils'
import { supabaseService } from '@/lib/supabase-service'
import QRCode from 'qrcode'

interface ProductFormProps {
  onProductCreated: (product: Product) => void
}

export default function ProductForm({ onProductCreated }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, image: file }))
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
        setErrors(prev => ({ ...prev, image: null }))
      } else {
        setErrors(prev => ({ ...prev, image: file }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required'
    }
    
    if (!formData.image) {
      newErrors.image = null
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateQRCode = async (productId: string): Promise<string> => {
    try {
      // Generate QR code with product page URL
      const productPageUrl = `${window.location.origin}/product/${productId}`
      const qrCodeDataURL = await QRCode.toDataURL(productPageUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsGenerating(true)

    try {
      const productId = generateProductId()
      const createdAt = new Date()
      
      // Upload product image to Supabase Storage
      const imageUploadResult = await supabaseService.uploadProductImage(productId, formData.image!)
      if (!imageUploadResult.success) {
        throw new Error(imageUploadResult.error || 'Failed to upload product image')
      }

      // Generate QR code with product page URL
      const qrCodeDataURL = await generateQRCode(productId)
      
      // Convert QR code to blob and upload to Supabase Storage
      const qrCodeBlob = supabaseService.dataURLtoBlob(qrCodeDataURL)
      const qrCodeUploadResult = await supabaseService.uploadQRCode(productId, qrCodeBlob)
      if (!qrCodeUploadResult.success) {
        throw new Error(qrCodeUploadResult.error || 'Failed to upload QR code')
      }

      const product: Product = {
        id: productId,
        name: formData.name,
        description: formData.description,
        image: imageUploadResult.url!,
        createdAt,
        qrCode: qrCodeUploadResult.url!
      }

      // Save to Supabase database
      const result = await supabaseService.createProduct(product)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save product')
      }

      onProductCreated(product)

      setFormData({ name: '', description: '', image: null })
      setImagePreview('')
      setErrors({})
    } catch (error) {
      console.error('Error creating product:', error)
      // You might want to show an error message to the user here
      alert('Failed to create product. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          Product QR Code Generator
        </CardTitle>
        <CardDescription>
          Create a new product entry and generate its QR code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Product Name *
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Product Description *
            </label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Product Image *
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> product image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">Product image is required</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>QR code will be generated with current timestamp</span>
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <QrCode className="mr-2 h-4 w-4 animate-spin" />
                Generating QR Code...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
