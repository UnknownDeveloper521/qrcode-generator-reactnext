# Product QR Code Generator

A modern, fully functional Product QR Code Generator built with Next.js and React. This application allows you to create QR codes for products and manage a comprehensive product database.

## Features

### QR Code Generator Interface
- **Product Name**: Text input (required)
- **Product Description**: Textarea (required) 
- **Product Image**: File upload supporting JPG, PNG, JPEG (required)
- **Auto-capture**: Current date/time when QR code is generated
- **Unique Product ID**: Generated using timestamp + random string

### Product Database System
- View all generated products in a beautiful grid layout
- Product cards showing image, name, description, and creation date
- Modal view for detailed product information
- Download QR codes as PNG files
- **Supabase Database Integration** - All data stored in PostgreSQL database
- Real-time data synchronization across devices

### Modern UI/UX
- Built with TailwindCSS for beautiful styling
- Responsive design that works on all devices
- Modern card-based layout
- Smooth animations and transitions
- Lucide React icons for consistent iconography

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS with custom design system
- **QR Code Generation**: qrcode library
- **Icons**: Lucide React
- **Backend**: Supabase for database operations and API

## Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn package manager
- A Supabase account (free tier available)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Follow the detailed instructions in `SUPABASE_SETUP.md`
   - Create a Supabase project and configure your `.env.local` file

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Creating a Product QR Code

1. **Navigate to "Generate QR Code" tab**
2. **Fill in the required fields**:
   - Product Name (required)
   - Product Description (required)
   - Upload Product Image (JPG, PNG, JPEG)
3. **Click "Generate QR Code"**
4. **The system will**:
   - Generate a unique product ID
   - Create a QR code containing the product ID
   - Save the product to the database
   - Automatically switch to the Product Database view

### Managing Products

1. **Navigate to "Product Database" tab**
2. **View all products** in a grid layout
3. **Click "View"** to see detailed product information
4. **Click "QR Code"** to download the QR code as PNG
5. **Use the modal** to view full product details and QR code

## Project Structure

```
qrcode-generator/
├── app/
│   ├── globals.css          # Global styles and Tailwind setup
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── ProductForm.tsx      # QR code generator form
│   └── ProductList.tsx      # Product database display
├── lib/
│   ├── storage.ts           # localStorage utilities
│   └── utils.ts             # Utility functions
├── types/
│   └── product.ts           # TypeScript type definitions
└── package.json             # Dependencies and scripts
```

## Features in Detail

### Unique Product ID Generation
Each product gets a unique identifier using the format:
```
PRD_{timestamp}_{randomString}
```

### QR Code Generation
- Uses the `qrcode` library for reliable QR code generation
- QR codes contain the unique product ID
- Generated as base64 data URLs for easy storage and download
- 256x256 pixel resolution with 2-pixel margin

### Data Persistence
- All product data is stored in Supabase PostgreSQL database
- Real-time synchronization across devices and sessions
- Automatic loading on page refresh
- Products include: ID, name, description, image, creation date, and QR code
- Scalable cloud database with built-in security

### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly interface
- Optimized for both desktop and mobile use

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please open an issue in the repository.
