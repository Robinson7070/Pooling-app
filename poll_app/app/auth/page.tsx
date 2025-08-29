'use client'

import { useState } from 'react'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center">
        {showLogin ? <Login /> : <Register />}
        <button
          onClick={() => setShowLogin(!showLogin)}
          className="text-sm text-blue-500 hover:underline mt-4"
        >
          {showLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  )
}