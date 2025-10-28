import type { AppStack } from '../types/full-stack-builder';

export function generateFrontendPackageJson(name: string, frontend: string, features: string[]): string {
  const dependencies: Record<string, string> = {
    next: "^13.0.0",
    react: "^18.0.0",
    "react-dom": "^18.0.0"
  };

  if (frontend === 'react-vite') {
    dependencies.vite = "^4.0.0";
    delete dependencies.next;
  }

  if (features.includes('TypeScript Support')) {
    dependencies.typescript = "^5.0.0";
  }

  return JSON.stringify({
    name: `${name}-frontend`,
    version: "1.0.0",
    scripts: {
      dev: frontend === 'nextjs' ? "next dev" : "vite",
      build: frontend === 'nextjs' ? "next build" : "vite build",
      start: frontend === 'nextjs' ? "next start" : "vite preview"
    },
    dependencies
  }, null, 2);
}

export function generateBackendPackageJson(name: string, backend: string, features: string[]): string {
  const dependencies: Record<string, string> = {};
  
  if (backend.includes('express')) {
    dependencies.express = "^4.18.0";
    dependencies.cors = "^2.8.5";
  }
  
  if (backend.includes('fastify')) {
    dependencies.fastify = "^4.0.0";
  }

  dependencies.dotenv = "^16.0.0";

  if (features.includes('Database Integration')) {
    dependencies.prisma = "^5.0.0";
  }

  return JSON.stringify({
    name: `${name}-backend`,
    version: "1.0.0",
    scripts: {
      dev: "nodemon src/app.ts",
      build: "tsc",
      start: "node dist/app.js"
    },
    dependencies,
    devDependencies: {
      "@types/express": "^4.17.0",
      "@types/cors": "^2.8.0",
      typescript: "^5.0.0",
      nodemon: "^3.0.0"
    }
  }, null, 2);
}

export function generateFrontendHomePage(name: string, description: string): string {
  return `import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>${name}</title>
        <meta name="description" content="${description}" />
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 ff-text-gradient">${name}</h1>
        <p className="text-xl text-muted-foreground mb-8">${description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ff-card-interactive p-6">
            <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
            <p className="text-muted-foreground">Description of your first feature</p>
          </div>
          <div className="ff-card-interactive p-6">
            <h2 className="text-xl font-semibold mb-2">Feature 2</h2>
            <p className="text-muted-foreground">Description of your second feature</p>
          </div>
          <div className="ff-card-interactive p-6">
            <h2 className="text-xl font-semibold mb-2">Feature 3</h2>
            <p className="text-muted-foreground">Description of your third feature</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}`;
}

export function generateLayoutComponent(): string {
  return `import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold ff-text-gradient">
                Your App
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-muted-foreground hover:text-foreground ff-hover-scale transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground ff-hover-scale transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="ff-fade-in-up">{children}</main>
      
      <footer className="bg-card border-t border-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; 2024 Your App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}`;
}

export function generateBackendApp(backend: string, features: string[]): string {
  let imports = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';`;

  if (features.includes('Database Integration')) {
    imports += `\nimport { PrismaClient } from '@prisma/client';`;
  }

  imports += `\nimport userRoutes from './routes/users';`;

  return `${imports}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

${features.includes('Database Integration') ? 'const prisma = new PrismaClient();' : ''}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

${features.includes('Rate Limiting') ? `
// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
` : ''}

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running!',
    version: '1.0.0',
    features: ${JSON.stringify(features)}
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📱 Environment: \${process.env.NODE_ENV || 'development'}\`);
  ${features.includes('Database Integration') ? "console.log('🗄️  Database connected');" : ''}
});

${features.includes('Database Integration') ? `
// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\\n🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
` : ''}

export default app;`;
}

export function generateUserRoutes(backend: string): string {
  return `import { Router, Request, Response } from 'express';
${backend.includes('Database Integration') ? "import { PrismaClient } from '@prisma/client';" : ''}

const router = Router();
${backend.includes('Database Integration') ? 'const prisma = new PrismaClient();' : ''}

// GET /api/users
router.get('/', async (req: Request, res: Response) => {
  try {
    ${backend.includes('Database Integration') ? `
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    ` : `
    // Mock data - replace with actual database query
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    `}
    
    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
});

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and email are required' 
      });
    }

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }
    
    ${backend.includes('Database Integration') ? `
    const user = await prisma.user.create({
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    ` : `
    // Mock user creation
    const user = { 
      id: Date.now(), 
      name, 
      email, 
      createdAt: new Date() 
    };
    `}
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create user' 
    });
  }
});

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    ${backend.includes('Database Integration') ? `
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    ` : `
    const user = null; // Mock - replace with actual database query
    `}
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
});

export default router;`;
}

export function generateAuthConfig(auth: string): string {
  if (auth === 'nextauth') {
    return `import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id || token?.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      console.log('User signed in:', message.user.email);
    },
  },
  debug: process.env.NODE_ENV === 'development',
});`;
  }
  
  return `// Auth configuration for ${auth}
// Configure your authentication provider here`;
}

export function generateAuthMiddleware(auth: string): string {
  return `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access denied. No token provided.' 
    });
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const generateToken = (payload: object): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  return jwt.sign(payload, jwtSecret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
};

export const refreshToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Implement refresh token logic here
  next();
};`;
}