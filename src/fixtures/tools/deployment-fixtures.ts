/**
 * Mock data fixtures for OneClickDeployTool
 * Extracted from components/tools/deployment/OneClickDeployTool.tsx
 */

/**
 * Deployment Platform Configuration
 */
export interface DeploymentPlatform {
  id: string;
  name: string;
  type: 'static' | 'fullstack' | 'serverless' | 'container';
  icon: string;
  description: string;
  pricing: string;
  features: string[];
  buildTime: string;
  freeThreshold: string;
  regions: string[];
  supported_frameworks: string[];
  requires_credit_card: boolean;
  ssl_included: boolean;
  custom_domains: boolean;
  environment_variables: boolean;
  monitoring: boolean;
  auto_scaling: boolean;
  databases: string[];
}

export const DEPLOYMENT_PLATFORMS: DeploymentPlatform[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    type: 'static',
    icon: '▲',
    description: 'Deploy frontend frameworks and static sites instantly',
    pricing: 'Free tier + $20/month pro',
    features: ['Edge Functions', 'Analytics', 'Preview Deployments', 'Git Integration'],
    buildTime: '1-3 minutes',
    freeThreshold: '100GB bandwidth',
    regions: ['Global Edge Network'],
    supported_frameworks: ['Next.js', 'React', 'Vue', 'Angular', 'Svelte', 'Nuxt'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['Vercel Postgres', 'Vercel Redis'],
  },
  {
    id: 'netlify',
    name: 'Netlify',
    type: 'static',
    icon: '🌐',
    description: 'All-in-one platform for automating modern web projects',
    pricing: 'Free tier + $19/month pro',
    features: ['Form Handling', 'Identity', 'Functions', 'Split Testing'],
    buildTime: '2-5 minutes',
    freeThreshold: '100GB bandwidth',
    regions: ['Global CDN'],
    supported_frameworks: ['React', 'Vue', 'Angular', 'Gatsby', 'Hugo', 'Jekyll'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['Netlify Graph'],
  },
  {
    id: 'aws',
    name: 'AWS',
    type: 'fullstack',
    icon: '☁️',
    description: 'Comprehensive cloud platform with unlimited scalability',
    pricing: 'Pay-as-you-go from $0.01',
    features: ['Global Infrastructure', 'Auto Scaling', 'Load Balancing', 'Monitoring'],
    buildTime: '5-15 minutes',
    freeThreshold: '750 hours/month EC2',
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    supported_frameworks: ['All frameworks supported'],
    requires_credit_card: true,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['RDS', 'DynamoDB', 'DocumentDB', 'Neptune'],
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    type: 'container',
    icon: '🌊',
    description: 'Simple cloud hosting for developers',
    pricing: '$5/month droplets',
    features: ['App Platform', 'Kubernetes', 'Databases', 'Spaces'],
    buildTime: '3-8 minutes',
    freeThreshold: '$100 credit for 60 days',
    regions: ['NYC', 'SFO', 'AMS', 'SGP', 'LON'],
    supported_frameworks: ['Docker', 'Node.js', 'Python', 'Go', 'PHP', 'Ruby'],
    requires_credit_card: true,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
  },
  {
    id: 'heroku',
    name: 'Heroku',
    type: 'fullstack',
    icon: '🟣',
    description: 'Platform as a service supporting several programming languages',
    pricing: 'Free tier + $7/month hobby',
    features: ['Add-ons Ecosystem', 'Git Deployment', 'Review Apps', 'Pipelines'],
    buildTime: '2-10 minutes',
    freeThreshold: '550 dyno hours/month',
    regions: ['US', 'Europe'],
    supported_frameworks: ['Node.js', 'Python', 'Ruby', 'Java', 'PHP', 'Go', 'Scala', 'Clojure'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['PostgreSQL', 'Redis', 'MySQL', 'MongoDB'],
  },
  {
    id: 'firebase',
    name: 'Firebase',
    type: 'serverless',
    icon: '🔥',
    description: "Google's mobile and web application development platform",
    pricing: 'Free tier + $25/month',
    features: ['Real-time Database', 'Authentication', 'Analytics', 'Cloud Functions'],
    buildTime: '1-5 minutes',
    freeThreshold: '10GB storage, 125K reads',
    regions: ['Global'],
    supported_frameworks: ['React', 'Angular', 'Vue', 'Flutter', 'Unity'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['Firestore', 'Realtime Database'],
  },
  {
    id: 'railway',
    name: 'Railway',
    type: 'fullstack',
    icon: '🚂',
    description: 'Deploy from GitHub repos, no config required',
    pricing: 'Free tier + $5/month pro',
    features: ['Zero Config', 'Git Integration', 'Instant Deployments', 'Metrics'],
    buildTime: '1-5 minutes',
    freeThreshold: '$5 usage credit',
    regions: ['US West', 'US East'],
    supported_frameworks: ['Node.js', 'Python', 'Go', 'Ruby', 'PHP', 'Rust'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
  },
  {
    id: 'render',
    name: 'Render',
    type: 'fullstack',
    icon: '🎨',
    description: 'Cloud platform for building and running all your apps',
    pricing: 'Free tier + $7/month',
    features: ['Auto Deploy', 'Zero Downtime', 'DDoS Protection', 'Health Checks'],
    buildTime: '2-8 minutes',
    freeThreshold: '750 hours/month',
    regions: ['Oregon', 'Ohio', 'Frankfurt', 'Singapore'],
    supported_frameworks: ['Docker', 'Node.js', 'Python', 'Ruby', 'Go', 'Rust'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['PostgreSQL', 'Redis'],
  },
];

export interface FrameworkConfig {
  name: string;
  build_command: string;
  output_directory: string;
  node_version: string;
}

export const FRAMEWORK_CONFIGS: Record<string, FrameworkConfig> = {
  next: {
    name: 'Next.js',
    build_command: 'npm run build',
    output_directory: '.next',
    node_version: '18',
  },
  react: {
    name: 'React',
    build_command: 'npm run build',
    output_directory: 'build',
    node_version: '18',
  },
  vue: {
    name: 'Vue.js',
    build_command: 'npm run build',
    output_directory: 'dist',
    node_version: '18',
  },
  angular: {
    name: 'Angular',
    build_command: 'ng build',
    output_directory: 'dist',
    node_version: '18',
  },
  svelte: {
    name: 'Svelte',
    build_command: 'npm run build',
    output_directory: 'public',
    node_version: '18',
  },
  node: {
    name: 'Node.js',
    build_command: 'npm install',
    output_directory: '.',
    node_version: '18',
  },
};
