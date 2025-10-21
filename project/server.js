let express = require('express')
require("dotenv").config()
let app = express()

// Import security packages
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const winston = require('winston')

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

// Production-ready helmet configuration
app.use(helmet({
  // Enable Content Security Policy (CSP) with a secure configuration
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      connectSrc: ["'self'", "https://*"],
      upgradeInsecureRequests: [],
    },
  },
  
  // Enable DNS prefetch control
  dnsPrefetchControl: {
    allow: false,
  },
  
  // Enable frameguard to prevent clickjacking
  frameguard: {
    action: "deny",
  },
  
  // Enable hide powered by to remove the X-Powered-By header
  hidePoweredBy: true,
  
  // Enable HTTP Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // Disable IE compatibility modes
  ieNoOpen: true,
  
  // Prevent browsers from MIME-sniffing
  noSniff: true,
  
  // Enable XSS filtering
  xssFilter: true,
  
  // Control referrer policy
  referrerPolicy: {
    policy: "no-referrer",
  },
}))

// Rate limiting for general API protection
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Rate limiting for authentication endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(generalLimiter)

// Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
    httpOnly: true, // Prevent client-side JavaScript access
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}))

// CORS configuration for secure cross-origin requests
const corsConfig = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsConfig))

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Parse JSON bodies with size limit
app.use(express.json({ limit: '10mb' }))

// Parse URL-encoded bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Security middleware for logging requests
app.use((req, res, next) => {
  // Log incoming requests for security monitoring
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  next()
})

// Input validation example middleware
const validateUserInput = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
]

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  
  if (!token) {
    logger.warn('Access attempt without token', { ip: req.ip, path: req.path })
    return res.sendStatus(401)
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-change-in-production', (err, user) => {
    if (err) {
      logger.warn('Invalid token attempt', { ip: req.ip, path: req.path, error: err.message })
      return res.sendStatus(403)
    }
    
    req.user = user
    next()
  })
}

// Example route with input validation
app.post('/register', validateUserInput, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn('Validation failed during registration', { errors: errors.array() })
      return res.status(400).json({ errors: errors.array() })
    }
    
    // Hash password before storing (in a real app, you'd save to a database)
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    
    // Log successful registration (without sensitive data)
    logger.info('User registration successful', { 
      username: req.body.username,
      email: req.body.email
    })
    
    res.json({ message: 'User registered successfully' })
  } catch (error) {
    logger.error('Registration error', { error: error.message })
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Example login route with rate limiting
app.post('/login', authLimiter, async (req, res) => {
  try {
    // In a real app, you would verify credentials against a database
    // This is just a demonstration of JWT token generation
    
    // Log login attempt
    logger.info('Login attempt', { 
      username: req.body.username,
      ip: req.ip
    })
    
    // Generate JWT token (in a real app, you'd verify credentials first)
    const token = jwt.sign(
      { username: req.body.username, userId: 123 },
      process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
      { expiresIn: '1h' }
    )
    
    logger.info('Login successful', { username: req.body.username })
    
    res.json({ 
      message: 'Login successful',
      token: token
    })
  } catch (error) {
    logger.error('Login error', { error: error.message })
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  logger.info('Access to protected resource', { user: req.user.username })
  res.json({ message: 'This is a protected route', user: req.user })
})

// Error handling middleware for security logging
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  })
  
  // Don't expose internal error details to client
  res.status(500).json({ message: 'Internal server error' })
})

// 404 handler with security logging
app.use((req, res) => {
  logger.warn('404 - Not Found', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  
  res.status(404).json({ message: 'Resource not found' })
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  console.log(`Server is running on port ${PORT}`)
})