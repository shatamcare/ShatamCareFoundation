import { getImagePath } from './imagePaths';

// Image categories and their expected folders
export const IMAGE_CATEGORIES = {
  'Brain Kit': 'images/Brain Kit',
  'Caregivers': 'images/Caregivers', 
  'Media': 'images/Media',
  'Team': 'images/Team',
  'Users': 'images/Users',
  'Events': 'images/Events'
} as const;

// Common image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Known images that exist (you can add to this list as you add images)
// This is the ONLY place you need to maintain image lists
export const KNOWN_IMAGES = {
  'Brain Kit': [
    'brain_bridge_boxcontent-1024x1024.jpeg',
    'kit.jpg',
    'tool kit.jpg'
  ],
  'Caregivers': [
    'career discussion.jpg',
    'hospital.jpg',
    'sessions.jpg',
    'training.jpg',
    'trainng 2.jpg'
  ],
  'Media': [
    // Add media images here
  ],
  'Team': [
    'Amrita.jpg',
    'SC_LOGO-removebg-preview.png'
  ],
  'Users': [
    'activities.jpg',
    'activities 1.jpg', 
    'activities 2.jpg',
    'art.jpg',
    'art 1.jpg',
    'care.jpg',
    'dementia care 1.jpg',
    'Dementia.jpg',
    'EHA.jpg',
    'EHA (1).jpg',
    'EHA (2).jpg',
    'EHA7.jpg',
    'EHA8.jpg',
    'eha3.jpg',
    'memory cafe.jpeg'
  ],
  'Events': [
    // Add event images here
  ]
} as const;

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  category: keyof typeof IMAGE_CATEGORIES;
  path: string;
}

/**
 * Get all available images for a category
 */
export function getCategoryImages(category: keyof typeof IMAGE_CATEGORIES): ImageFile[] {
  const images = KNOWN_IMAGES[category] || [];
  const basePath = IMAGE_CATEGORIES[category];
  
  return images.map((imageName, index) => ({
    id: `${category.toLowerCase().replace(' ', '_')}_${index + 1}`,
    name: imageName,
    url: getImagePath(`${basePath}/${imageName}`),
    category,
    path: `${basePath}/${imageName}`
  }));
}

/**
 * Get all available images across all categories
 */
export function getAllAvailableImages(): ImageFile[] {
  const allImages: ImageFile[] = [];
  
  (Object.keys(IMAGE_CATEGORIES) as Array<keyof typeof IMAGE_CATEGORIES>).forEach(category => {
    allImages.push(...getCategoryImages(category));
  });
  
  return allImages;
}

/**
 * Find images by name or partial name
 */
export function findImagesByName(searchTerm: string): ImageFile[] {
  const allImages = getAllAvailableImages();
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return allImages.filter(image => 
    image.name.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Get a specific image by name and category
 */
export function getImageByName(imageName: string, category?: keyof typeof IMAGE_CATEGORIES): ImageFile | null {
  if (category) {
    const categoryImages = getCategoryImages(category);
    return categoryImages.find(img => img.name === imageName) || null;
  }
  
  const allImages = getAllAvailableImages();
  return allImages.find(img => img.name === imageName) || null;
}

/**
 * Check if an image exists in our known images
 */
export function imageExists(imageName: string, category?: keyof typeof IMAGE_CATEGORIES): boolean {
  return getImageByName(imageName, category) !== null;
}

/**
 * Get fallback image URL
 */
export function getFallbackImageUrl(): string {
  return getImagePath('images/fallback.svg');
}

/**
 * Safe image loader - returns the image URL if it exists, fallback otherwise
 */
export function safeImageUrl(imageName: string, category?: keyof typeof IMAGE_CATEGORIES): string {
  const image = getImageByName(imageName, category);
  return image ? image.url : getFallbackImageUrl();
}

/**
 * Add new images to the known images list (for future expansion)
 * This function helps you add new images programmatically
 */
export function addImageToCategory(category: keyof typeof IMAGE_CATEGORIES, imageName: string): void {
  // In a real app, this might update a database or config file
  // For now, this is a helper function that tells you what to add to KNOWN_IMAGES
  console.log(`To add "${imageName}" to ${category}, add it to KNOWN_IMAGES.${category} in dynamicImageLoader.ts`);
}
