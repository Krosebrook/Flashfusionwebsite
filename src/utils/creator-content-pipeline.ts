import { ContentOutput } from '../types/creator-content-pipeline';

export const generateContentTemplate = (
  outputType: string,
  platform: string,
  inputContent: string
): string => {
  switch (outputType) {
    case 'Script':
      return `🎬 Hook: "${inputContent.slice(0, 50)}..."

✨ Opening:
Hey creators! Let me share something that completely changed my perspective...

🔥 Main Content:
[Your main message here, broken into 3 key points]

💫 Call to Action:
Drop a 🔥 if this resonates with you!`;

    case 'Post Captions':
      return `✨ ${inputContent.slice(0, 100)}...

Here's what I learned that changed everything:

1️⃣ First key insight
2️⃣ Second breakthrough moment
3️⃣ The game-changing realization

💭 What's been your biggest learning lately?

#ContentCreator #Growth #Inspiration`;

    case 'Blog Posts':
      return `# The Ultimate Guide: ${inputContent.slice(0, 60)}

## Introduction

In today's fast-paced digital landscape, understanding [topic] has become crucial for success...

## Key Points

### 1. Foundation Principles
[Detailed explanation]

### 2. Advanced Strategies
[Implementation guide]

### 3. Common Pitfalls
[What to avoid]

## Conclusion

By implementing these strategies, you'll be well-positioned to...

*Word count: ~1,200 words*`;

    case 'Product Descriptions':
      return `🌟 **Premium Quality You Can Trust**

Transform your experience with this carefully crafted solution that delivers exceptional results.

✅ **Key Benefits:**
• Premium materials & construction
• Proven results in 30 days or less
• 5-star customer satisfaction rating
• Money-back guarantee

🎯 **Perfect For:**
- Busy professionals seeking efficiency
- Quality-conscious customers
- Those who value premium experiences

**Limited Time:** Free shipping + 20% off your first order!`;

    default:
      return `Optimized ${outputType.toLowerCase()} for ${platform}:

${inputContent.slice(0, 200)}...

Tailored specifically for maximum engagement on ${platform} with platform-specific best practices and formatting.`;
  }
};

export const calculateEngagementEstimate = (): number => {
  return Math.floor(Math.random() * 500) + 50;
};

export const downloadContent = (outputs: ContentOutput[]) => {
  const content = outputs.map(output => 
    `=== ${output.platform} - ${output.type} ===\n\n${output.content}\n\n`
  ).join('');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content-pipeline-output.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (content: string): Promise<void> => {
  await navigator.clipboard.writeText(content);
};