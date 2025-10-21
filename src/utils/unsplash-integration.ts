/**
 * @fileoverview Unsplash Integration Utility
 * @chunk utils
 * @category utilities
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Utility function to integrate with Unsplash for high-quality stock images
 * used as placeholders for AI-generated images in demo mode.
 */

/**
 * Fetches a high-quality image from Unsplash based on search query
 * This is used as a demonstration of real image generation capabilities
 * 
 * @param query - Search query for image content
 * @returns Promise<string> - URL of the fetched image
 */
export async function unsplash_tool(query: string): Promise<string> {
  try {
    // Clean and prepare search query
    const cleanQuery = query.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(' ')
      .slice(0, 3) // Limit to 3 keywords for better results
      .join(' ');

    // Use Unsplash's source API for direct image access
    // This provides high-quality, free-to-use images for demonstration
    const searchTerm = cleanQuery || 'abstract art';
    const imageUrl = `https://source.unsplash.com/1024x1024/?${encodeURIComponent(searchTerm)}`;
    
    // Verify the image is accessible
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`✅ Fetched Unsplash image for: "${searchTerm}"`);
      return imageUrl;
    } else {
      throw new Error('Image not accessible');
    }
  } catch (error) {
    console.warn('⚠️ Unsplash fetch failed, using fallback:', error);
    
    // Fallback to a random abstract image
    return `https://source.unsplash.com/1024x1024/?abstract,art&${Date.now()}`;
  }
}

/**
 * Get multiple images for batch generation
 * 
 * @param query - Search query
 * @param count - Number of images to fetch
 * @returns Promise<string[]> - Array of image URLs
 */
export async function unsplash_tool_batch(query: string, count: number = 4): Promise<string[]> {
  const images: string[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      // Add slight variation to each query to get different images
      const variedQuery = `${query} ${i + 1}`;
      const imageUrl = await unsplash_tool(variedQuery);
      images.push(imageUrl);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to fetch image ${i + 1}:`, error);
      // Add fallback image
      images.push(`https://source.unsplash.com/1024x1024/?random&${Date.now() + i}`);
    }
  }
  
  return images;
}

/**
 * Get image with specific dimensions
 * 
 * @param query - Search query
 * @param width - Image width
 * @param height - Image height
 * @returns Promise<string> - URL of the fetched image
 */
export async function unsplash_tool_sized(query: string, width: number = 1024, height: number = 1024): Promise<string> {
  try {
    const cleanQuery = query.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');

    const searchTerm = cleanQuery || 'abstract art';
    const imageUrl = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(searchTerm)}`;
    
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`✅ Fetched ${width}x${height} Unsplash image for: "${searchTerm}"`);
      return imageUrl;
    } else {
      throw new Error('Image not accessible');
    }
  } catch (error) {
    console.warn('⚠️ Sized Unsplash fetch failed, using fallback:', error);
    return `https://source.unsplash.com/${width}x${height}/?abstract,art&${Date.now()}`;
  }
}

export default unsplash_tool;