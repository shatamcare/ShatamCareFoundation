import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resolveImageUrl, getImageWithFallback } from '@/utils/imageUrlResolver';
import { getImagePath } from '@/utils/imagePaths';
import { X, Search, Eye, ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploaded_at: string;
}

interface ImageSelectorProps {
  images: MediaFile[];
  onSelect: (url: string, name: string) => void;
  onClose: () => void;
  title?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  onSelect,
  onClose,
  title = "Select Image"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState<MediaFile[]>(images);

  // Filter images when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image => 
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchTerm, images]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search input */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-4 overflow-hidden flex-1">
          <ScrollArea className="h-[50vh]">
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer border-2 border-transparent hover:border-warm-teal rounded-lg transition-colors"
                    onClick={() => onSelect(image.url, image.name)}
                  >
                    <img
                      src={resolveImageUrl(image.url)}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        console.warn(`Failed to load thumbnail: ${image.name}`);
                        e.currentTarget.src = getImagePath('images/placeholder.jpg');
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                      <p className="truncate">{image.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mb-4 text-gray-300" />
                {searchTerm ? (
                  <p>No images found matching "{searchTerm}"</p>
                ) : (
                  <p>No images available. Upload images through the Media page first.</p>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageSelector;
