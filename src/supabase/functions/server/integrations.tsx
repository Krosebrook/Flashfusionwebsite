// External integrations for FlashFusion
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// GitHub integration
export async function analyzeGitHubRepository(repoUrl: string, accessToken?: string) {
  const githubToken = accessToken || Deno.env.get('Github');
  if (!githubToken) {
    throw new Error('GitHub token not available');
  }

  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace('.git', '');

    // Get repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository: ${repoResponse.statusText}`);
    }

    const repoData = await repoResponse.json();

    // Get repository contents
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const contents = contentsResponse.ok ? await contentsResponse.json() : [];

    // Get file structure
    const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${repoData.default_branch}?recursive=1`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const fileStructure = treeResponse.ok ? await treeResponse.json() : { tree: [] };

    // Analyze technologies
    const technologies = await analyzeRepositoryTechnologies(contents, fileStructure.tree);

    // Get recent commits
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=10`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const commits = commitsResponse.ok ? await commitsResponse.json() : [];

    return {
      repository: repoData,
      contents,
      fileStructure: fileStructure.tree,
      technologies,
      commits,
      analysis: {
        framework: detectFramework(technologies),
        buildTool: detectBuildTool(technologies),
        packageManager: detectPackageManager(contents),
        hasDocumentation: hasDocumentation(contents),
        testSetup: detectTestSetup(technologies),
        cicdSetup: detectCICD(contents)
      }
    };

  } catch (error) {
    console.error('GitHub repository analysis error:', error);
    throw error;
  }
}

// Vercel deployment integration
export async function deployToVercel(projectData: any, accessToken?: string) {
  const vercelToken = accessToken || Deno.env.get('Vercel');
  if (!vercelToken) {
    throw new Error('Vercel token not available');
  }

  try {
    const deploymentResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectData.name,
        files: projectData.files,
        projectSettings: {
          framework: projectData.framework,
          buildCommand: projectData.buildCommand,
          outputDirectory: projectData.outputDirectory,
          installCommand: projectData.installCommand
        },
        target: 'production'
      })
    });

    if (!deploymentResponse.ok) {
      const error = await deploymentResponse.text();
      throw new Error(`Vercel deployment failed: ${error}`);
    }

    const deployment = await deploymentResponse.json();

    // Wait for deployment to complete
    let status = 'BUILDING';
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max wait

    while (status === 'BUILDING' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deployment.id}`, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.readyState;
      }
      
      attempts++;
    }

    return {
      ...deployment,
      status,
      url: `https://${deployment.url}`,
      readyState: status
    };

  } catch (error) {
    console.error('Vercel deployment error:', error);
    throw error;
  }
}

// Netlify deployment integration
export async function deployToNetlify(projectData: any, accessToken?: string) {
  const netlifyToken = accessToken || Deno.env.get('Netlify_token');
  if (!netlifyToken) {
    throw new Error('Netlify token not available');
  }

  try {
    // Create site
    const siteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectData.name,
        build_settings: {
          cmd: projectData.buildCommand || 'npm run build',
          dir: projectData.outputDirectory || 'dist'
        }
      })
    });

    if (!siteResponse.ok) {
      throw new Error(`Failed to create Netlify site: ${siteResponse.statusText}`);
    }

    const site = await siteResponse.json();

    // Deploy files
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/zip'
      },
      body: await createDeploymentZip(projectData.files)
    });

    if (!deployResponse.ok) {
      throw new Error(`Failed to deploy to Netlify: ${deployResponse.statusText}`);
    }

    const deploy = await deployResponse.json();

    return {
      site,
      deploy,
      url: `https://${site.default_domain || site.name}.netlify.app`,
      status: deploy.state
    };

  } catch (error) {
    console.error('Netlify deployment error:', error);
    throw error;
  }
}

// Stripe payment processing
export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
  const stripeKey = Deno.env.get('stripe_secret_api_key');
  if (!stripeKey) {
    throw new Error('Stripe secret key not available');
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency,
        'automatic_payment_methods[enabled]': 'true',
        'metadata[platform]': 'flashfusion',
        ...Object.fromEntries(
          Object.entries(metadata).map(([key, value]) => [`metadata[${key}]`, String(value)])
        )
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create payment intent: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw error;
  }
}

// OpenAI integration
export async function generateWithOpenAI(prompt: string, model: string = 'gpt-4-turbo', systemPrompt?: string) {
  const openaiKey = Deno.env.get('Openai_api_key');
  if (!openaiKey) {
    throw new Error('OpenAI API key not available');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw error;
  }
}

// Anthropic Claude integration
export async function generateWithClaude(prompt: string, model: string = 'claude-3-5-sonnet-20241022', systemPrompt?: string) {
  const anthropicKey = Deno.env.get('Anthropic');
  if (!anthropicKey) {
    throw new Error('Anthropic API key not available');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.1,
        system: systemPrompt || '',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  } catch (error) {
    console.error('Anthropic generation error:', error);
    throw error;
  }
}

// Google Gemini integration
export async function generateWithGemini(prompt: string, systemPrompt?: string) {
  const geminiKey = Deno.env.get('Gemini_api_key');
  if (!geminiKey) {
    throw new Error('Gemini API key not available');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: (systemPrompt ? `${systemPrompt}\n\n` : '') + prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
}

// Leap AI image generation
export async function generateImageWithLeap(prompt: string, style?: string) {
  const leapKey = Deno.env.get('Leap_api_key');
  if (!leapKey) {
    throw new Error('Leap AI API key not available');
  }

  try {
    const response = await fetch('https://api.tryleap.ai/api/v1/images/models/26a1a203-3a46-42cb-8cfa-f4de075907d8/inferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${leapKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `${prompt}${style ? ` in ${style} style` : ''}`,
        steps: 50,
        width: 1024,
        height: 1024,
        numberOfImages: 1,
        promptStrength: 7,
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      throw new Error(`Leap AI error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Poll for completion
    const inferenceId = data.id;
    let status = 'processing';
    let attempts = 0;
    const maxAttempts = 30;

    while (status === 'processing' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(`https://api.tryleap.ai/api/v1/images/models/26a1a203-3a46-42cb-8cfa-f4de075907d8/inferences/${inferenceId}`, {
        headers: {
          'Authorization': `Bearer ${leapKey}`
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.state;
        
        if (status === 'finished') {
          return statusData.images[0]?.uri || null;
        }
      }
      
      attempts++;
    }

    throw new Error('Image generation timeout');
  } catch (error) {
    console.error('Leap AI image generation error:', error);
    throw error;
  }
}

// ElevenLabs voice synthesis
export async function generateVoiceWithElevenLabs(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
  const elevenlabsKey = Deno.env.get('Elevellabs_api_key');
  if (!elevenlabsKey) {
    throw new Error('ElevenLabs API key not available');
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return new Uint8Array(audioBuffer);
  } catch (error) {
    console.error('ElevenLabs voice generation error:', error);
    throw error;
  }
}

// Helper functions
function analyzeRepositoryTechnologies(contents: any[], fileStructure: any[]): string[] {
  const technologies: string[] = [];
  const filenames = contents.map(item => item.name?.toLowerCase() || '');
  const allFiles = fileStructure.map(item => item.path?.toLowerCase() || '');

  // Detect technologies based on files
  if (filenames.includes('package.json') || allFiles.some(f => f.includes('package.json'))) {
    technologies.push('Node.js');
  }
  if (filenames.includes('yarn.lock')) technologies.push('Yarn');
  if (filenames.includes('pnpm-lock.yaml')) technologies.push('PNPM');
  if (filenames.includes('requirements.txt')) technologies.push('Python');
  if (filenames.includes('cargo.toml')) technologies.push('Rust');
  if (filenames.includes('go.mod')) technologies.push('Go');
  if (filenames.includes('gemfile')) technologies.push('Ruby');
  if (filenames.includes('composer.json')) technologies.push('PHP');
  if (filenames.includes('dockerfile')) technologies.push('Docker');
  if (filenames.includes('next.config.js')) technologies.push('Next.js');
  if (filenames.includes('vue.config.js')) technologies.push('Vue.js');
  if (filenames.includes('angular.json')) technologies.push('Angular');
  if (filenames.includes('tsconfig.json')) technologies.push('TypeScript');
  if (filenames.includes('tailwind.config.js')) technologies.push('Tailwind CSS');

  return technologies;
}

function detectFramework(technologies: string[]): string {
  if (technologies.includes('Next.js')) return 'Next.js';
  if (technologies.includes('Vue.js')) return 'Vue.js';
  if (technologies.includes('Angular')) return 'Angular';
  if (technologies.includes('Node.js')) return 'React';
  return 'Unknown';
}

function detectBuildTool(technologies: string[]): string {
  if (technologies.includes('Next.js')) return 'Next.js';
  if (technologies.includes('Vue.js')) return 'Vue CLI';
  if (technologies.includes('Angular')) return 'Angular CLI';
  return 'Webpack';
}

function detectPackageManager(contents: any[]): string {
  const filenames = contents.map(item => item.name?.toLowerCase() || '');
  if (filenames.includes('pnpm-lock.yaml')) return 'pnpm';
  if (filenames.includes('yarn.lock')) return 'yarn';
  if (filenames.includes('package-lock.json')) return 'npm';
  return 'npm';
}

function hasDocumentation(contents: any[]): boolean {
  const filenames = contents.map(item => item.name?.toLowerCase() || '');
  return filenames.includes('readme.md') || filenames.includes('docs');
}

function detectTestSetup(technologies: string[]): string {
  // This would be more sophisticated in a real implementation
  return 'Jest';
}

function detectCICD(contents: any[]): boolean {
  const filenames = contents.map(item => item.name?.toLowerCase() || '');
  return filenames.includes('.github') || filenames.includes('.gitlab-ci.yml') || filenames.includes('.travis.yml');
}

async function createDeploymentZip(files: Record<string, string>): Promise<Uint8Array> {
  // This would create an actual ZIP file in a real implementation
  // For now, returning a placeholder
  const textEncoder = new TextEncoder();
  return textEncoder.encode(JSON.stringify(files));
}