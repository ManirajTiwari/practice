import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import './App.css'

interface AuthFormData {
  name?: string
  identifier?: string // Email or Phone for Login
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

interface ApiResponse {
  message?: string
  detail?: string
  token?: string
}

const App: React.FC = () => {
  const [apiMessage, setApiMessage] = useState<string>('')
  const [isSignUp, setIsSignUp] = useState<boolean>(true)

  // Form State
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    identifier: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  // Fetch initial API test message
  useEffect(() => {
    fetch('http://localhost:8000/api/auth/')
      .then((res) => res.json())
      .then((data: ApiResponse) => setApiMessage(data.message || ''))
      .catch((err) => console.error('Error fetching data:', err))
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!')
        return
      }

      try {
        const res = await fetch('http://localhost:8000/api/auth/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          })
        })
        const data: ApiResponse = await res.json()
        if (res.ok) {
          setSuccess('Account created successfully! Please log in.')
          setIsSignUp(false)
        } else {
          setError(data.detail || 'Registration failed.')
        }
      } catch (err) {
        setError('Server error during registration.')
      }
    } else {
      try {
        const res = await fetch('http://localhost:8000/api/auth/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          })
        })
        const data: ApiResponse = await res.json()
        if (res.ok) {
          setSuccess('Login successful!')
        } else {
          setError(data.detail || 'Invalid credentials.')
        }
      } catch (err) {
        setError('Server error during login.')
      }
    }
  }

  const handleSocialAuth = (provider: 'google' | 'github'): void => {
    window.location.href = `http://localhost:8000/api/auth/${provider}/`
  }

  return (
    <div className="auth-container">
      <div className="api-status">
        <p>
          Backend Status: <strong>{apiMessage || 'Connecting...'}</strong>
        </p>
      </div>

      <div className="auth-card">
        <h2>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>

        <div className="social-buttons">
          <button
            type="button"
            className="btn-social google"
            onClick={() => handleSocialAuth('google')}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="btn-social github"
            onClick={() => handleSocialAuth('github')}
          >
            Continue with GitHub
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="identifier">Email or Phone Number</label>
              <input
                id="identifier"
                type="text"
                name="identifier"
                placeholder="Enter Email or Phone Number"
                value={formData.identifier || ''}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password || ''}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-submit">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="toggle-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="btn-toggle"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
            }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default App