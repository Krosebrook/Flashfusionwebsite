# FlashFusion API Reference

Comprehensive API documentation for all FlashFusion endpoints, including authentication, request/response formats, and code examples.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Core APIs](#core-apis)
3. [AI Services API](#ai-services-api)
4. [Multi-Agent Orchestration API](#multi-agent-orchestration-api)
5. [Creator Content Pipeline API](#creator-content-pipeline-api)
6. [Full-Stack Builder API](#full-stack-builder-api)
7. [Deployment API](#deployment-api)
8. [Analytics API](#analytics-api)
9. [Collaboration API](#collaboration-api)
10. [Webhooks & Events](#webhooks--events)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Base URL
```
Production:  https://api.flashfusion.com/v1
Staging:     https://staging-api.flashfusion.com/v1
Development: http://localhost:3001/api/v1
```

### Authentication Methods

#### API Key Authentication
```http
Authorization: Bearer <your-api-key>
Content-Type: application/json
```

#### JWT Token Authentication
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Get API Key
```http POST /auth/api-keys
{
  "name": "My Application",
  "scopes": ["read", "write", "admin"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "apiKey": "ff_api_1234567890abcdef",
  "name": "My Application",
  "scopes": ["read", "write", "admin"],
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Authentication Endpoints

#### Login
```http POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expiresAt": "2024-01-15T11:30:00Z"
  }
}
```

#### Refresh Token
```http POST /auth/refresh
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

#### Logout
```http POST /auth/logout
Authorization: Bearer <jwt-token>
```

---

## 🔧 Core APIs

### User Management

#### Get Current User
```http GET /users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "organization": {
    "id": "org-456",
    "name": "Acme Corp",
    "plan": "pro"
  },
  "preferences": {
    "theme": "dark",
    "language": "en",
    "timezone": "America/New_York"
  },
  "usage": {
    "aiGenerations": 147,
    "deployments": 23,
    "storageUsed": "2.3GB"
  }
}
```

#### Update User Profile
```http PATCH /users/me
Authorization: Bearer <token>
{
  "name": "John Smith",
  "preferences": {
    "theme": "light",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}
```

### Organization Management

#### Get Organization
```http GET /organizations/{org-id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "org-456",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "plan": "enterprise",
  "members": [
    {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@acme.com",
      "role": "admin",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "settings": {
    "allowGuestAccess": false,
    "enforceSSO": true,
    "dataRetentionDays": 90
  },
  "usage": {
    "totalMembers": 25,
    "aiGenerations": 5432,
    "storageUsed": "45.2GB",
    "billingPeriod": "monthly"
  }
}
```

### Project Management

#### List Projects
```http GET /projects
Authorization: Bearer <token>
?limit=20&offset=0&sort=created_at&order=desc&filter=active
```

**Response:**
```json
{
  "projects": [
    {
      "id": "proj-789",
      "name": "E-commerce Website",
      "description": "Modern e-commerce platform with AI-powered recommendations",
      "type": "fullstack",
      "status": "active",
      "owner": {
        "id": "user-123",
        "name": "John Doe"
      },
      "framework": "react",
      "deployments": 3,
      "lastDeployment": "2024-01-14T15:30:00Z",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-14T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### Create Project
```http POST /projects
Authorization: Bearer <token>
{
  "name": "My New App",
  "description": "Description of the project",
  "type": "fullstack",
  "template": "react-ecommerce",
  "features": ["auth", "database", "payments"],
  "config": {
    "framework": "react",
    "database": "supabase",
    "styling": "tailwind"
  }
}
```

#### Get Project Details
```http GET /projects/{project-id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "proj-789",
  "name": "E-commerce Website",
  "description": "Modern e-commerce platform",
  "type": "fullstack",
  "status": "active",
  "config": {
    "framework": "react",
    "database": "supabase",
    "styling": "tailwind",
    "features": ["auth", "database", "payments", "analytics"]
  },
  "files": [
    {
      "path": "src/App.tsx",
      "size": 2048,
      "lastModified": "2024-01-14T15:30:00Z"
    }
  ],
  "deployments": [
    {
      "id": "deploy-abc",
      "url": "https://my-app-xyz.vercel.app",
      "status": "success",
      "provider": "vercel",
      "deployedAt": "2024-01-14T15:30:00Z"
    }
  ],
  "collaborators": [
    {
      "id": "user-456",
      "name": "Jane Smith",
      "role": "editor",
      "addedAt": "2024-01-12T10:00:00Z"
    }
  ]
}
```

---

## 🤖 AI Services API

### AI Generation

#### Generate Content
```http POST /ai/generate
Authorization: Bearer <token>
{
  "type": "content",
  "model": "gpt-4",
  "prompt": "Write a blog post about sustainable technology",
  "options": {
    "maxTokens": 1000,
    "temperature": 0.7,
    "platform": "linkedin",
    "tone": "professional",
    "audience": "tech professionals"
  },
  "context": {
    "brandVoice": "innovative and approachable",
    "previousContent": ["blog-post-123", "social-post-456"]
  }
}
```

**Response:**
```json
{
  "id": "gen-abc123",
  "type": "content",
  "model": "gpt-4",
  "result": {
    "content": "# Sustainable Technology: Building a Greener Future\n\nTechnology has the power to transform our world...",
    "metadata": {
      "wordCount": 847,
      "readingTime": "3 minutes",
      "keywords": ["sustainable", "technology", "environment", "innovation"],
      "sentiment": "positive",
      "platformOptimized": "linkedin"
    }
  },
  "usage": {
    "tokensUsed": 892,
    "cost": 0.0178,
    "processingTime": 3.2
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Generate Code
```http POST /ai/generate
Authorization: Bearer <token>
{
  "type": "code",
  "model": "codex",
  "prompt": "Create a React component for a user profile card",
  "options": {
    "language": "typescript",
    "framework": "react",
    "styling": "tailwind",
    "features": ["responsive", "dark-mode", "accessibility"]
  },
  "context": {
    "existingComponents": ["Button", "Avatar", "Card"],
    "designSystem": "material-ui"
  }
}
```

**Response:**
```json
{
  "id": "gen-def456",
  "type": "code",
  "model": "codex",
  "result": {
    "code": "import React from 'react';\nimport { Avatar } from './Avatar';\n\ninterface UserProfileProps {\n  user: User;\n  className?: string;\n}\n\nexport function UserProfile({ user, className }: UserProfileProps) {\n  return (\n    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>\n      <Avatar src={user.avatar} alt={user.name} size=\"lg\" />\n      <h3 className=\"text-xl font-semibold text-gray-900 dark:text-white mt-4\">\n        {user.name}\n      </h3>\n      <p className=\"text-gray-600 dark:text-gray-300\">{user.email}</p>\n    </div>\n  );\n}",
    "files": [
      {
        "path": "components/UserProfile.tsx",
        "content": "...",
        "dependencies": ["./Avatar", "react"]
      }
    ],
    "metadata": {
      "linesOfCode": 23,
      "complexity": "low",
      "testCoverage": 0,
      "dependencies": ["react", "./Avatar"]
    }
  },
  "usage": {
    "tokensUsed": 456,
    "cost": 0.0091,
    "processingTime": 2.1
  }
}
```

### Model Management

#### List Available Models
```http GET /ai/models
Authorization: Bearer <token>
```

**Response:**
```json
{
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "openai",
      "capabilities": ["text", "code", "analysis"],
      "pricing": {
        "inputTokens": 0.03,
        "outputTokens": 0.06,
        "currency": "USD",
        "per": 1000
      },
      "limits": {
        "maxTokens": 8192,
        "requestsPerMinute": 500
      },
      "status": "available"
    },
    {
      "id": "claude-3",
      "name": "Claude 3",
      "provider": "anthropic",
      "capabilities": ["text", "analysis", "reasoning"],
      "pricing": {
        "inputTokens": 0.015,
        "outputTokens": 0.075,
        "currency": "USD",
        "per": 1000
      },
      "limits": {
        "maxTokens": 100000,
        "requestsPerMinute": 1000
      },
      "status": "available"
    }
  ]
}
```

#### Get Model Usage Statistics
```http GET /ai/models/{model-id}/usage
Authorization: Bearer <token>
?timeframe=30d
```

**Response:**
```json
{
  "modelId": "gpt-4",
  "timeframe": "30d",
  "statistics": {
    "totalRequests": 1247,
    "totalTokens": 892456,
    "totalCost": 17.85,
    "averageLatency": 2.3,
    "successRate": 99.2,
    "topUseCases": [
      {
        "type": "content_generation",
        "count": 456,
        "percentage": 36.6
      },
      {
        "type": "code_generation",
        "count": 234,
        "percentage": 18.8
      }
    ]
  }
}
```

---

## 🎭 Multi-Agent Orchestration API

### Workflow Management

#### Create Workflow
```http POST /workflows
Authorization: Bearer <token>
{
  "name": "Content Marketing Campaign",
  "description": "Automated content creation and distribution",
  "triggers": [
    {
      "type": "schedule",
      "config": {
        "cron": "0 9 * * MON",
        "timezone": "America/New_York"
      }
    }
  ],
  "steps": [
    {
      "id": "research",
      "name": "Market Research",
      "agent": "research-agent",
      "config": {
        "topics": ["AI", "productivity", "automation"],
        "sources": ["google-trends", "reddit", "twitter"]
      }
    },
    {
      "id": "content-creation",
      "name": "Create Content",
      "agent": "content-agent",
      "dependencies": ["research"],
      "config": {
        "formats": ["blog-post", "social-media", "newsletter"],
        "brandVoice": "professional-friendly"
      }
    },
    {
      "id": "distribution",
      "name": "Distribute Content",
      "agent": "distribution-agent",
      "dependencies": ["content-creation"],
      "config": {
        "platforms": ["linkedin", "twitter", "blog"],
        "schedule": "staggered"
      }
    }
  ]
}
```

**Response:**
```json
{
  "id": "workflow-abc123",
  "name": "Content Marketing Campaign",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "nextRun": "2024-01-22T14:00:00Z",
  "stats": {
    "totalRuns": 0,
    "successfulRuns": 0,
    "averageRunTime": null
  }
}
```

#### Execute Workflow
```http POST /workflows/{workflow-id}/execute
Authorization: Bearer <token>
{
  "input": {
    "topic": "AI productivity tools",
    "targetAudience": "small business owners",
    "urgency": "normal"
  },
  "options": {
    "parallel": true,
    "timeout": 3600
  }
}
```

**Response:**
```json
{
  "executionId": "exec-def456",
  "workflowId": "workflow-abc123",
  "status": "running",
  "startedAt": "2024-01-15T10:30:00Z",
  "steps": [
    {
      "stepId": "research",
      "status": "completed",
      "startedAt": "2024-01-15T10:30:00Z",
      "completedAt": "2024-01-15T10:32:15Z",
      "output": {
        "trends": ["AI automation", "small business efficiency"],
        "insights": ["Growing demand for simple AI tools"]
      }
    },
    {
      "stepId": "content-creation",
      "status": "running",
      "startedAt": "2024-01-15T10:32:15Z",
      "estimatedCompletion": "2024-01-15T10:35:00Z"
    },
    {
      "stepId": "distribution",
      "status": "pending",
      "estimatedStart": "2024-01-15T10:35:00Z"
    }
  ]
}
```

### Agent Management

#### List Available Agents
```http GET /agents
Authorization: Bearer <token>
```

**Response:**
```json
{
  "agents": [
    {
      "id": "content-agent-v2",
      "name": "Content Generator Agent",
      "type": "content",
      "version": "2.1.0",
      "capabilities": [
        "blog-posts",
        "social-media",
        "email-campaigns",
        "product-descriptions"
      ],
      "status": "available",
      "load": 23,
      "maxConcurrency": 10,
      "averageProcessingTime": 45.2
    },
    {
      "id": "code-agent-v3",
      "name": "Code Generation Agent",
      "type": "development",
      "version": "3.0.1",
      "capabilities": [
        "react-components",
        "api-endpoints",
        "database-schemas",
        "test-cases"
      ],
      "status": "available",
      "load": 67,
      "maxConcurrency": 5,
      "averageProcessingTime": 78.9
    }
  ]
}
```

#### Get Agent Performance
```http GET /agents/{agent-id}/performance
Authorization: Bearer <token>
?timeframe=7d
```

**Response:**
```json
{
  "agentId": "content-agent-v2",
  "timeframe": "7d",
  "metrics": {
    "totalTasks": 156,
    "successfulTasks": 152,
    "failedTasks": 4,
    "successRate": 97.4,
    "averageProcessingTime": 45.2,
    "throughput": 22.3,
    "qualityScore": 4.6,
    "userSatisfaction": 4.8
  },
  "performance": [
    {
      "date": "2024-01-15",
      "tasks": 23,
      "averageTime": 43.1,
      "successRate": 100
    }
  ]
}
```

---

## 🎨 Creator Content Pipeline API

### Content Generation

#### Generate Social Media Content
```http POST /content/generate/social
Authorization: Bearer <token>
{
  "topic": "Sustainable living tips",
  "platforms": ["instagram", "twitter", "linkedin"],
  "contentType": "tips",
  "tone": "friendly",
  "targetAudience": "millennials",
  "brandVoice": {
    "personality": "approachable",
    "values": ["sustainability", "simplicity"],
    "doNot": ["be preachy", "use jargon"]
  },
  "requirements": {
    "includeHashtags": true,
    "includeEmojis": true,
    "callToAction": "Visit our website"
  }
}
```

**Response:**
```json
{
  "id": "content-gen-789",
  "topic": "Sustainable living tips",
  "generated": [
    {
      "platform": "instagram",
      "content": {
        "caption": "🌱 5 Simple Swaps for Sustainable Living ✨\n\n1. Glass containers instead of plastic 🫙\n2. Bamboo toothbrushes 🎋\n3. Reusable water bottles 💧\n4. LED bulbs for energy saving 💡\n5. Cloth shopping bags 🛍️\n\nSmall changes, big impact! What's your favorite eco-friendly swap? 💚\n\n👆 Visit our website for more sustainable living tips!\n\n#SustainableLiving #EcoFriendly #GreenLiving #Sustainability #ZeroWaste #EcoTips #GoGreen",
        "hashtags": ["#SustainableLiving", "#EcoFriendly", "#GreenLiving"],
        "wordCount": 67,
        "characterCount": 312,
        "estimatedReach": "medium",
        "engagementPrediction": "high"
      }
    },
    {
      "platform": "twitter",
      "content": {
        "tweet": "🌱 Quick sustainable swaps that make a difference:\n\n✅ Glass → Plastic containers\n✅ Bamboo → Regular toothbrush  \n✅ Reusable → Single-use water bottles\n✅ LED → Incandescent bulbs\n✅ Cloth → Plastic shopping bags\n\nSmall steps, big impact! 💚\n\nMore tips: [link]",
        "hashtags": ["#SustainableLiving", "#EcoTips"],
        "characterCount": 243,
        "threadSuggestion": false
      }
    }
  ],
  "metadata": {
    "processingTime": 12.3,
    "qualityScore": 4.7,
    "brandAlignment": 4.8,
    "readabilityScore": 8.2
  }
}
```

#### Generate Blog Content
```http POST /content/generate/blog
Authorization: Bearer <token>
{
  "title": "The Future of Remote Work: AI-Powered Productivity Tools",
  "targetLength": 1500,
  "audience": "business professionals",
  "tone": "authoritative",
  "structure": "introduction-main-points-conclusion",
  "seoKeywords": ["remote work", "AI productivity", "future of work"],
  "includeOutline": true,
  "includeMetaDescription": true
}
```

**Response:**
```json
{
  "id": "blog-gen-456",
  "content": {
    "title": "The Future of Remote Work: AI-Powered Productivity Tools",
    "metaDescription": "Discover how AI-powered productivity tools are reshaping remote work, boosting efficiency, and creating new opportunities for distributed teams.",
    "outline": [
      {
        "section": "Introduction",
        "subsections": ["The Remote Work Revolution", "Enter AI-Powered Tools"]
      },
      {
        "section": "Current State of Remote Work Productivity",
        "subsections": ["Challenges", "Traditional Solutions", "Limitations"]
      },
      {
        "section": "AI-Powered Productivity Tools",
        "subsections": ["Automation Tools", "Communication Enhancement", "Time Management"]
      },
      {
        "section": "Future Implications",
        "subsections": ["Workplace Evolution", "Skills Requirements", "Organizational Changes"]
      }
    ],
    "body": "# The Future of Remote Work: AI-Powered Productivity Tools\n\n## Introduction\n\nThe remote work revolution has fundamentally transformed how we approach professional collaboration...",
    "wordCount": 1523,
    "readingTime": 6,
    "seoAnalysis": {
      "keywordDensity": {
        "remote work": 2.1,
        "AI productivity": 1.8,
        "future of work": 1.2
      },
      "readabilityScore": 7.8,
      "seoScore": 85
    }
  }
}
```

### Brand Management

#### Create Brand Voice Profile
```http POST /content/brand-voice
Authorization: Bearer <token>
{
  "name": "Tech Startup Voice",
  "description": "Innovative, approachable, and technical",
  "trainingData": {
    "contentSamples": [
      "content-sample-1",
      "content-sample-2"
    ],
    "brandGuidelines": {
      "tone": ["innovative", "approachable", "confident"],
      "avoid": ["corporate jargon", "overly technical"],
      "vocabulary": ["cutting-edge", "streamlined", "intuitive"],
      "writingStyle": "conversational but professional"
    }
  }
}
```

**Response:**
```json
{
  "id": "brand-voice-123",
  "name": "Tech Startup Voice",
  "status": "training",
  "trainingProgress": 0,
  "estimatedCompletion": "2024-01-15T12:00:00Z",
  "metrics": {
    "samplesAnalyzed": 0,
    "patternAccuracy": null,
    "voiceConsistency": null
  }
}
```

#### Analyze Content for Brand Alignment
```http POST /content/analyze/brand-alignment
Authorization: Bearer <token>
{
  "content": "Our revolutionary AI platform streamlines your workflow with cutting-edge automation that's incredibly intuitive to use.",
  "brandVoiceId": "brand-voice-123"
}
```

**Response:**
```json
{
  "brandAlignment": {
    "overall": 4.6,
    "tone": 4.8,
    "vocabulary": 4.5,
    "style": 4.4
  },
  "suggestions": [
    {
      "type": "vocabulary",
      "message": "Consider using 'streamlined' instead of 'revolutionary' for better brand consistency",
      "confidence": 0.85
    }
  ],
  "matchingElements": [
    "cutting-edge",
    "streamlined",
    "intuitive"
  ],
  "offBrandElements": [
    "revolutionary"
  ]
}
```

---

## 💻 Full-Stack Builder API

### Project Creation

#### Create Application
```http POST /builder/applications
Authorization: Bearer <token>
{
  "name": "E-commerce Dashboard",
  "type": "fullstack",
  "template": "ecommerce-admin",
  "framework": "react",
  "features": [
    "authentication",
    "database",
    "payment-processing",
    "analytics",
    "real-time-updates"
  ],
  "configuration": {
    "database": {
      "type": "postgresql",
      "provider": "supabase"
    },
    "authentication": {
      "methods": ["email", "google", "github"],
      "roles": ["admin", "manager", "viewer"]
    },
    "styling": {
      "framework": "tailwindcss",
      "theme": "modern-dark"
    },
    "deployment": {
      "platform": "vercel",
      "environment": "production"
    }
  }
}
```

**Response:**
```json
{
  "id": "app-build-789",
  "name": "E-commerce Dashboard",
  "status": "initializing",
  "progress": {
    "percentage": 0,
    "currentStep": "Project Setup",
    "estimatedCompletion": "2024-01-15T11:15:00Z"
  },
  "buildSteps": [
    {
      "step": "project-initialization",
      "status": "pending",
      "estimatedDuration": 30
    },
    {
      "step": "component-generation",
      "status": "pending", 
      "estimatedDuration": 180
    },
    {
      "step": "database-setup",
      "status": "pending",
      "estimatedDuration": 60
    },
    {
      "step": "authentication-setup",
      "status": "pending",
      "estimatedDuration": 120
    },
    {
      "step": "deployment-preparation",
      "status": "pending",
      "estimatedDuration": 90
    }
  ]
}
```

#### Get Build Status
```http GET /builder/applications/{build-id}/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "app-build-789",
  "status": "building",
  "progress": {
    "percentage": 65,
    "currentStep": "Database Setup",
    "timeElapsed": 180,
    "estimatedTimeRemaining": 120
  },
  "completedSteps": [
    {
      "step": "project-initialization",
      "status": "completed",
      "duration": 28,
      "output": {
        "projectStructure": "created",
        "dependencies": "installed",
        "configuration": "applied"
      }
    },
    {
      "step": "component-generation", 
      "status": "completed",
      "duration": 152,
      "output": {
        "components": 23,
        "pages": 8,
        "hooks": 12,
        "utils": 6
      }
    }
  ],
  "currentStep": {
    "step": "database-setup",
    "status": "in-progress",
    "progress": 80,
    "logs": [
      "Creating database tables...",
      "Setting up Row Level Security...",
      "Generating database types..."
    ]
  }
}
```

### Code Generation

#### Generate Component
```http POST /builder/generate/component
Authorization: Bearer <token>
{
  "name": "ProductCard",
  "type": "react-component",
  "framework": "react",
  "styling": "tailwindcss",
  "props": [
    {
      "name": "product",
      "type": "Product",
      "required": true
    },
    {
      "name": "onAddToCart",
      "type": "function",
      "required": false
    },
    {
      "name": "className",
      "type": "string", 
      "required": false
    }
  ],
  "features": [
    "responsive",
    "dark-mode",
    "accessibility",
    "loading-states"
  ]
}
```

**Response:**
```json
{
  "id": "component-gen-456",
  "name": "ProductCard",
  "files": [
    {
      "path": "components/ProductCard.tsx",
      "content": "import React, { useState } from 'react';\nimport { Product } from '../types/Product';\n\ninterface ProductCardProps {\n  product: Product;\n  onAddToCart?: (productId: string) => void;\n  className?: string;\n}\n\nexport function ProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {\n  const [isLoading, setIsLoading] = useState(false);\n\n  const handleAddToCart = async () => {\n    if (!onAddToCart) return;\n    \n    setIsLoading(true);\n    try {\n      await onAddToCart(product.id);\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  return (\n    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${className}`}>\n      <img\n        src={product.image}\n        alt={product.name}\n        className=\"w-full h-48 object-cover\"\n        loading=\"lazy\"\n      />\n      <div className=\"p-4\">\n        <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-2\">\n          {product.name}\n        </h3>\n        <p className=\"text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2\">\n          {product.description}\n        </p>\n        <div className=\"flex items-center justify-between\">\n          <span className=\"text-xl font-bold text-primary\">\n            ${product.price.toFixed(2)}\n          </span>\n          {onAddToCart && (\n            <button\n              onClick={handleAddToCart}\n              disabled={isLoading}\n              className=\"bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"\n              aria-label={`Add ${product.name} to cart`}\n            >\n              {isLoading ? 'Adding...' : 'Add to Cart'}\n            </button>\n          )}\n        </div>\n      </div>\n    </div>\n  );\n}"
    },
    {
      "path": "components/__tests__/ProductCard.test.tsx",
      "content": "import { render, screen, fireEvent, waitFor } from '@testing-library/react';\nimport { ProductCard } from '../ProductCard';\nimport { mockProduct } from '../../__mocks__/product';\n\ndescribe('ProductCard', () => {\n  it('renders product information correctly', () => {\n    render(<ProductCard product={mockProduct} />);\n    \n    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();\n    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();\n    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();\n  });\n\n  it('calls onAddToCart when button is clicked', async () => {\n    const mockOnAddToCart = jest.fn();\n    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);\n    \n    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));\n    \n    await waitFor(() => {\n      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);\n    });\n  });\n});"
    }
  ],
  "dependencies": ["react"],
  "metadata": {
    "linesOfCode": 52,
    "testCoverage": 85,
    "accessibility": "WCAG AA compliant",
    "performance": "Optimized with lazy loading"
  }
}
```

### Template Management

#### List Templates
```http GET /builder/templates
Authorization: Bearer <token>
?category=ecommerce&framework=react
```

**Response:**
```json
{
  "templates": [
    {
      "id": "ecommerce-store",
      "name": "E-commerce Store",
      "description": "Complete online store with product catalog, cart, and checkout",
      "category": "ecommerce",
      "framework": "react",
      "features": [
        "product-catalog",
        "shopping-cart",
        "user-authentication",
        "payment-processing",
        "order-management"
      ],
      "preview": {
        "images": [
          "https://cdn.flashfusion.com/templates/ecommerce-store/preview-1.jpg"
        ],
        "demoUrl": "https://ecommerce-store-demo.flashfusion.com"
      },
      "popularity": 4.8,
      "usageCount": 1247,
      "lastUpdated": "2024-01-10T00:00:00Z"
    }
  ]
}
```

---

## 🚀 Deployment API

### Deployment Management

#### Deploy Application
```http POST /deployments
Authorization: Bearer <token>
{
  "projectId": "proj-789",
  "platform": "vercel",
  "environment": "production",
  "configuration": {
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "environmentVariables": {
      "NODE_ENV": "production",
      "API_URL": "https://api.myapp.com"
    },
    "domains": [
      "myapp.com",
      "www.myapp.com"
    ]
  },
  "options": {
    "autoPromote": true,
    "rollbackOnFailure": true,
    "notifications": ["email", "slack"]
  }
}
```

**Response:**
```json
{
  "id": "deploy-abc123",
  "projectId": "proj-789",
  "platform": "vercel",
  "status": "building",
  "url": "https://myapp-git-main-username.vercel.app",
  "domains": ["myapp.com", "www.myapp.com"],
  "startedAt": "2024-01-15T10:30:00Z",
  "buildLogs": [
    {
      "timestamp": "2024-01-15T10:30:05Z",
      "level": "info",
      "message": "Installing dependencies..."
    },
    {
      "timestamp": "2024-01-15T10:30:45Z",
      "level": "info", 
      "message": "Running build command..."
    }
  ],
  "estimatedCompletion": "2024-01-15T10:33:00Z"
}
```

#### Get Deployment Status
```http GET /deployments/{deployment-id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "deploy-abc123",
  "projectId": "proj-789",
  "platform": "vercel",
  "status": "success",
  "url": "https://myapp.com",
  "domains": ["myapp.com", "www.myapp.com"],
  "startedAt": "2024-01-15T10:30:00Z",
  "completedAt": "2024-01-15T10:32:45Z",
  "duration": 165,
  "buildInfo": {
    "buildTime": 120,
    "bundleSize": "2.4 MB",
    "chunks": 12,
    "treeshaking": "95% unused code removed"
  },
  "performance": {
    "lighthouse": {
      "performance": 95,
      "accessibility": 100,
      "bestPractices": 92,
      "seo": 100
    },
    "coreWebVitals": {
      "lcp": 1.2,
      "fid": 12,
      "cls": 0.05
    }
  }
}
```

### Environment Management

#### List Deployment Environments
```http GET /deployments/environments
Authorization: Bearer <token>
?projectId=proj-789
```

**Response:**
```json
{
  "environments": [
    {
      "name": "production",
      "url": "https://myapp.com",
      "branch": "main",
      "autoDeployEnabled": true,
      "lastDeployment": {
        "id": "deploy-abc123",
        "status": "success",
        "deployedAt": "2024-01-15T10:32:45Z"
      },
      "environmentVariables": 15,
      "customDomains": 2
    },
    {
      "name": "staging",
      "url": "https://staging-myapp.com",
      "branch": "develop",
      "autoDeployEnabled": true,
      "lastDeployment": {
        "id": "deploy-def456", 
        "status": "success",
        "deployedAt": "2024-01-15T09:15:30Z"
      },
      "environmentVariables": 12,
      "customDomains": 1
    }
  ]
}
```

---

## 📊 Analytics API

### Usage Analytics

#### Get Platform Usage Statistics
```http GET /analytics/usage
Authorization: Bearer <token>
?timeframe=30d&granularity=daily
```

**Response:**
```json
{
  "timeframe": "30d",
  "granularity": "daily", 
  "metrics": {
    "totalGenerations": 1247,
    "totalDeployments": 89,
    "totalUsers": 156,
    "totalProjects": 45
  },
  "trends": [
    {
      "date": "2024-01-15",
      "aiGenerations": 67,
      "deployments": 5,
      "activeUsers": 23,
      "newProjects": 2
    }
  ],
  "topFeatures": [
    {
      "feature": "content-generation",
      "usage": 45.2,
      "trend": "+12%"
    },
    {
      "feature": "code-generation",
      "usage": 28.7,
      "trend": "+8%"
    }
  ]
}
```

#### Get Project Analytics
```http GET /analytics/projects/{project-id}
Authorization: Bearer <token>
?timeframe=7d
```

**Response:**
```json
{
  "projectId": "proj-789",
  "timeframe": "7d",
  "performance": {
    "totalViews": 2547,
    "uniqueVisitors": 892,
    "averageSessionDuration": 245,
    "bounceRate": 32.4,
    "conversionRate": 3.7
  },
  "traffic": {
    "sources": [
      {
        "source": "organic",
        "visitors": 456,
        "percentage": 51.1
      },
      {
        "source": "direct",
        "visitors": 234,
        "percentage": 26.2
      }
    ]
  },
  "technical": {
    "averageLoadTime": 1.2,
    "errorRate": 0.15,
    "uptime": 99.9,
    "coreWebVitals": {
      "lcp": 1.4,
      "fid": 8,
      "cls": 0.03
    }
  }
}
```

### Performance Monitoring

#### Get Performance Metrics
```http GET /analytics/performance
Authorization: Bearer <token>
?projectId=proj-789&timeframe=24h
```

**Response:**
```json
{
  "projectId": "proj-789",
  "timeframe": "24h",
  "metrics": {
    "responseTime": {
      "average": 245,
      "p50": 180,
      "p95": 450,
      "p99": 890
    },
    "throughput": {
      "requestsPerSecond": 12.4,
      "totalRequests": 1072320
    },
    "errors": {
      "total": 156,
      "rate": 0.015,
      "breakdown": {
        "4xx": 89,
        "5xx": 67
      }
    },
    "availability": {
      "uptime": 99.95,
      "downtime": 7.2
    }
  },
  "alerts": [
    {
      "type": "performance",
      "severity": "warning", 
      "message": "Response time increased by 15% compared to last week",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 👥 Collaboration API

### Real-time Collaboration

#### Join Collaboration Session
```http POST /collaboration/sessions/{project-id}/join
Authorization: Bearer <token>
```

**Response:**
```json
{
  "sessionId": "collab-session-123",
  "projectId": "proj-789",
  "websocketUrl": "wss://collab.flashfusion.com/sessions/collab-session-123",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "participants": [
    {
      "userId": "user-456",
      "name": "Jane Smith",
      "avatar": "https://avatar.com/jane.jpg",
      "cursor": {
        "x": 450,
        "y": 230,
        "color": "#3B82F6"
      },
      "activeFile": "src/components/Header.tsx"
    }
  ],
  "permissions": {
    "canEdit": true,
    "canComment": true,
    "canInvite": false
  }
}
```

#### Send Collaboration Event
```websocket
// WebSocket message format
{
  "type": "cursor_move",
  "sessionId": "collab-session-123",
  "userId": "user-123",
  "data": {
    "x": 345,
    "y": 167,
    "file": "src/App.tsx"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Text change event
{
  "type": "text_change",
  "sessionId": "collab-session-123", 
  "userId": "user-123",
  "data": {
    "file": "src/App.tsx",
    "operation": {
      "type": "insert",
      "position": 245,
      "text": "const newFeature = "
    }
  },
  "timestamp": "2024-01-15T10:30:15Z"
}
```

### Team Management

#### Invite Team Member
```http POST /collaboration/invites
Authorization: Bearer <token>
{
  "email": "newmember@company.com",
  "projectId": "proj-789",
  "role": "editor",
  "permissions": {
    "canEdit": true,
    "canComment": true,
    "canDeploy": false,
    "canInvite": false
  },
  "message": "Welcome to our project! Looking forward to collaborating."
}
```

**Response:**
```json
{
  "inviteId": "invite-abc123",
  "email": "newmember@company.com",
  "projectId": "proj-789",
  "role": "editor",
  "status": "sent",
  "inviteUrl": "https://flashfusion.com/invites/invite-abc123",
  "expiresAt": "2024-01-22T10:30:00Z",
  "sentAt": "2024-01-15T10:30:00Z"
}
```

---

## 📡 Webhooks & Events

### Webhook Configuration

#### Create Webhook
```http POST /webhooks
Authorization: Bearer <token>
{
  "name": "Deployment Notifications",
  "url": "https://api.myapp.com/webhooks/deployments",
  "events": [
    "deployment.started",
    "deployment.completed", 
    "deployment.failed"
  ],
  "filters": {
    "projectId": "proj-789"
  },
  "secret": "webhook-secret-123",
  "active": true
}
```

**Response:**
```json
{
  "id": "webhook-123",
  "name": "Deployment Notifications",
  "url": "https://api.myapp.com/webhooks/deployments",
  "events": [
    "deployment.started",
    "deployment.completed",
    "deployment.failed"
  ],
  "secret": "webhook-secret-123",
  "active": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Event Types

#### Available Events
```json
{
  "events": [
    {
      "name": "project.created",
      "description": "Triggered when a new project is created",
      "payload": {
        "projectId": "string",
        "name": "string", 
        "ownerId": "string",
        "createdAt": "string"
      }
    },
    {
      "name": "deployment.started",
      "description": "Triggered when a deployment begins",
      "payload": {
        "deploymentId": "string",
        "projectId": "string",
        "platform": "string",
        "startedAt": "string"
      }
    },
    {
      "name": "ai.generation.completed",
      "description": "Triggered when AI generation completes",
      "payload": {
        "generationId": "string",
        "type": "string",
        "model": "string",
        "tokensUsed": "number",
        "completedAt": "string"
      }
    }
  ]
}
```

#### Webhook Payload Example
```json
{
  "id": "event-789",
  "event": "deployment.completed",
  "timestamp": "2024-01-15T10:32:45Z",
  "data": {
    "deploymentId": "deploy-abc123",
    "projectId": "proj-789",
    "platform": "vercel",
    "status": "success",
    "url": "https://myapp.com",
    "duration": 165
  },
  "signature": "sha256=8b2c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c"
}
```

---

## ❌ Error Handling

### Error Response Format

All API errors follow this consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-abc123"
  }
}
```

### HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|--------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary service outage |

### Common Error Codes

```json
{
  "errorCodes": {
    "AUTHENTICATION_FAILED": "Invalid credentials provided",
    "INSUFFICIENT_PERMISSIONS": "User lacks required permissions",
    "RESOURCE_NOT_FOUND": "Requested resource does not exist",
    "VALIDATION_ERROR": "Request validation failed",
    "RATE_LIMIT_EXCEEDED": "API rate limit exceeded",
    "QUOTA_EXCEEDED": "Usage quota exceeded",
    "MODEL_UNAVAILABLE": "Requested AI model is not available",
    "GENERATION_FAILED": "AI generation process failed",
    "DEPLOYMENT_FAILED": "Application deployment failed",
    "WEBHOOK_DELIVERY_FAILED": "Webhook delivery unsuccessful"
  }
}
```

---

## ⏱️ Rate Limiting

### Rate Limit Headers

All API responses include rate limiting information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 985
X-RateLimit-Reset: 1705315800
X-RateLimit-Window: 3600
```

### Rate Limits by Plan

| Plan | Requests/Hour | AI Generations/Hour | Deployments/Day |
|------|---------------|-------------------|-----------------|
| Starter | 100 | 10 | 5 |
| Pro | 1,000 | 100 | 50 |
| Enterprise | 10,000 | 1,000 | Unlimited |

### Rate Limit Exceeded Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 1000,
      "window": 3600,
      "resetAt": "2024-01-15T11:30:00Z"
    }
  }
}
```

---

This API reference provides comprehensive documentation for all FlashFusion endpoints. For additional examples, SDKs, and interactive documentation, visit our [Developer Portal](https://developers.flashfusion.com).

*API Version: v1.0 | Last Updated: January 2024*