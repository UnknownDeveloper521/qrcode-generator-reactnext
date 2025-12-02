import { Product } from '@/types/product'

const STORAGE_KEY = 'qr_generator_products'

export const saveProduct = (product: Product): void => {
  try {
    const existingProducts = getProducts()
    const updatedProducts = [...existingProducts, product]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts))
  } catch (error) {
    console.error('Error saving product to localStorage:', error)
  }
}

export const getProducts = (): Product[] => {
  try {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const products = JSON.parse(stored)
    return products.map((product: any) => ({
      ...product,
      createdAt: new Date(product.createdAt)
    }))
  } catch (error) {
    console.error('Error loading products from localStorage:', error)
    return []
  }
}

export const deleteProduct = (productId: string): void => {
  try {
    const existingProducts = getProducts()
    const updatedProducts = existingProducts.filter(product => product.id !== productId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts))
  } catch (error) {
    console.error('Error deleting product from localStorage:', error)
  }
}

export const clearAllProducts = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing products from localStorage:', error)
  }
}
