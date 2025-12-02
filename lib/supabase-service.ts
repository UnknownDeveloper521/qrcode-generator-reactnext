import { supabase } from './supabase'
import { Product } from '@/types/product'

// Storage bucket names
const PRODUCT_IMAGES_BUCKET = 'product-images'
const QR_CODES_BUCKET = 'qr-codes'

// Convert database row to Product type
const dbRowToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  image: row.image_url,
  qrCode: row.qr_code_url,
  createdAt: new Date(row.created_at)
})

// Convert Product to database insert format
const productToDbInsert = (product: Product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  image_url: product.image,
  qr_code_url: product.qrCode || '',
  created_at: product.createdAt.toISOString()
})

export const supabaseService = {
  // Upload file to Supabase Storage
  async uploadFile(
    bucket: string, 
    filePath: string, 
    file: File | Blob, 
    contentType?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: contentType || 'image/jpeg',
          upsert: true
        })

      if (error) {
        console.error('Error uploading file:', error)
        return { success: false, error: error.message }
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return { success: true, url: urlData.publicUrl }
    } catch (error) {
      console.error('Error uploading file:', error)
      return { success: false, error: 'Failed to upload file' }
    }
  },

  // Upload product image
  async uploadProductImage(productId: string, imageFile: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const fileExtension = imageFile.name.split('.').pop() || 'jpg'
    const filePath = `${productId}/image.${fileExtension}`
    
    return this.uploadFile(PRODUCT_IMAGES_BUCKET, filePath, imageFile, imageFile.type)
  },

  // Upload QR code
  async uploadQRCode(productId: string, qrCodeBlob: Blob): Promise<{ success: boolean; url?: string; error?: string }> {
    const filePath = `${productId}/qr-code.png`
    
    return this.uploadFile(QR_CODES_BUCKET, filePath, qrCodeBlob, 'image/png')
  },

  // Convert data URL to Blob
  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  },

  // Create a new product
  async createProduct(product: Product): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .insert([productToDbInsert(product)])

      if (error) {
        console.error('Error creating product:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error creating product:', error)
      return { success: false, error: 'Failed to create product' }
    }
  },

  // Get all products
  async getProducts(): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return { success: false, error: error.message }
      }

      const products = data?.map(dbRowToProduct) || []
      return { success: true, data: products }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { success: false, error: 'Failed to fetch products' }
    }
  },

  // Get a single product by ID
  async getProduct(id: string): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return { success: false, error: error.message }
      }

      const product = dbRowToProduct(data)
      return { success: true, data: product }
    } catch (error) {
      console.error('Error fetching product:', error)
      return { success: false, error: 'Failed to fetch product' }
    }
  },

  // Update a product
  async updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {}
      
      if (updates.name) updateData.name = updates.name
      if (updates.description) updateData.description = updates.description
      if (updates.image) updateData.image_url = updates.image
      if (updates.qrCode) updateData.qr_code_url = updates.qrCode

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating product:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, error: 'Failed to update product' }
    }
  },

  // Delete a product
  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, error: 'Failed to delete product' }
    }
  },

  // Test connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .limit(1)

      if (error) {
        console.error('Connection test failed:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Connection test failed:', error)
      return { success: false, error: 'Failed to connect to database' }
    }
  }
}
