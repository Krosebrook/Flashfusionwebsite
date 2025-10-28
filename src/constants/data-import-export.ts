import type { ImportJob, ExportJob, DataSource, DataTemplate } from '../types/data-import-export';

export const DATA_HUB_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: ['CSV', 'JSON', 'XML', 'SQL', 'Excel', 'ZIP'],
  REFRESH_INTERVAL: 5000,
  MAX_CONCURRENT_JOBS: 5,
  RETRY_ATTEMPTS: 3,
  JOB_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

export const JOB_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const FILE_TYPE_ICONS = {
  csv: '📊',
  json: '📋',
  xml: '🗂️',
  sql: '🗄️',
  excel: '📈',
  zip: '📦',
  pdf: '📄',
  image: '🖼️',
} as const;

export const IMPORT_EXPORT_CATEGORIES = [
  { id: 'all', name: 'All Sources', count: 0 },
  { id: 'database', name: 'Databases', count: 0 },
  { id: 'api', name: 'APIs', count: 0 },
  { id: 'file', name: 'Files', count: 0 },
  { id: 'cloud', name: 'Cloud Storage', count: 0 },
] as const;

// Mock data
export const MOCK_IMPORT_JOBS: ImportJob[] = [
  {
    id: 'import-1',
    name: 'Customer Database Import',
    type: 'database',
    source: 'PostgreSQL Production',
    status: 'completed',
    progress: 100,
    format: 'CSV',
    size: 15.6,
    recordsProcessed: 12500,
    totalRecords: 12500,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    errors: []
  },
  {
    id: 'import-2',
    name: 'Product Catalog Sync',
    type: 'api',
    source: 'Shopify API',
    status: 'processing',
    progress: 65,
    format: 'JSON',
    size: 8.2,
    recordsProcessed: 3250,
    totalRecords: 5000,
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    errors: ['SKU-12345: Invalid price format']
  },
  {
    id: 'import-3',
    name: 'User Activity Logs',
    type: 'file',
    source: 'CSV Upload',
    status: 'failed',
    progress: 25,
    format: 'CSV',
    size: 45.8,
    recordsProcessed: 1250,
    totalRecords: 5000,
    startTime: new Date(Date.now() - 45 * 60 * 1000),
    endTime: new Date(Date.now() - 40 * 60 * 1000),
    errors: ['Row 1251: Missing required field "user_id"', 'Row 1252: Invalid date format']
  }
];

export const MOCK_EXPORT_JOBS: ExportJob[] = [
  {
    id: 'export-1',
    name: 'Monthly Sales Report',
    type: 'file',
    destination: 'Local Download',
    status: 'completed',
    progress: 100,
    format: 'Excel',
    size: 12.4,
    recordsExported: 8500,
    totalRecords: 8500,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 50 * 60 * 1000),
    downloadUrl: '#',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 'export-2',
    name: 'User Data Backup',
    type: 'cloud',
    destination: 'AWS S3',
    status: 'processing',
    progress: 80,
    format: 'JSON',
    size: 156.8,
    recordsExported: 40000,
    totalRecords: 50000,
    startTime: new Date(Date.now() - 45 * 60 * 1000)
  }
];

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'postgres-1',
    name: 'Production Database',
    type: 'database',
    provider: 'PostgreSQL',
    icon: '🐘',
    connected: true,
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    syncStatus: 'active',
    config: { host: 'prod-db.example.com', database: 'app_production' },
    supportedFormats: ['CSV', 'JSON', 'SQL']
  },
  {
    id: 'shopify-1',
    name: 'Shopify Store',
    type: 'api',
    provider: 'Shopify',
    icon: '🛒',
    connected: true,
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    syncStatus: 'active',
    config: { store: 'mystore.myshopify.com' },
    supportedFormats: ['JSON', 'CSV']
  },
  {
    id: 'aws-s3',
    name: 'AWS S3 Bucket',
    type: 'cloud',
    provider: 'Amazon S3',
    icon: '☁️',
    connected: true,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    syncStatus: 'active',
    config: { bucket: 'my-data-bucket' },
    supportedFormats: ['All formats']
  },
  {
    id: 'github-1',
    name: 'GitHub Repository',
    type: 'api',
    provider: 'GitHub',
    icon: '🔗',
    connected: false,
    lastSync: new Date(0),
    syncStatus: 'inactive',
    config: {},
    supportedFormats: ['JSON', 'ZIP']
  }
];

export const MOCK_TEMPLATES: DataTemplate[] = [
  {
    id: 'user-import',
    name: 'User Data Import',
    description: 'Template for importing user profiles and account information',
    type: 'import',
    format: 'CSV',
    fields: [
      { name: 'email', type: 'string', required: true, example: 'user@example.com' },
      { name: 'name', type: 'string', required: true, example: 'John Doe' },
      { name: 'phone', type: 'string', required: false, example: '+1234567890' },
      { name: 'created_at', type: 'date', required: false, example: '2024-01-15' }
    ],
    sampleData: [
      { email: 'john@example.com', name: 'John Doe', phone: '+1234567890', created_at: '2024-01-15' },
      { email: 'jane@example.com', name: 'Jane Smith', phone: '+0987654321', created_at: '2024-01-16' }
    ]
  },
  {
    id: 'product-export',
    name: 'Product Catalog Export',
    description: 'Template for exporting product information with pricing and inventory',
    type: 'export',
    format: 'JSON',
    fields: [
      { name: 'id', type: 'number', required: true, example: '1001' },
      { name: 'name', type: 'string', required: true, example: 'Premium Widget' },
      { name: 'price', type: 'number', required: true, example: '29.99' },
      { name: 'inventory', type: 'number', required: false, example: '150' }
    ],
    sampleData: [
      { id: 1001, name: 'Premium Widget', price: 29.99, inventory: 150 },
      { id: 1002, name: 'Standard Widget', price: 19.99, inventory: 200 }
    ]
  }
];