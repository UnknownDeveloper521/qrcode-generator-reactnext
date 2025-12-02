export interface Product {
  id: string
  name: string
  description: string
  image: string
  createdAt: Date
  qrCode?: string
}

export interface ProductFormData {
  name: string
  description: string
  image: File | null
}
