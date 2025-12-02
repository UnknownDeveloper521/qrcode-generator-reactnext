'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseService } from '@/lib/supabase-service'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function SupabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus(null)

    try {
      const result = await supabaseService.testConnection()
      
      if (result.success) {
        setConnectionStatus({
          success: true,
          message: 'Successfully connected to Supabase database!'
        })
      } else {
        setConnectionStatus({
          success: false,
          message: result.error || 'Failed to connect to database'
        })
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Connection test failed: ' + (error as Error).message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Database Connection Test</CardTitle>
        <CardDescription>
          Test your Supabase database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>

        {connectionStatus && (
          <div className={`flex items-center gap-2 p-3 rounded-md ${
            connectionStatus.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {connectionStatus.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm">{connectionStatus.message}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Environment Check:</strong></p>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
