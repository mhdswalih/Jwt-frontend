import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, password: string, image: string | null) => void;
  initialName?: string;
  initialImage?: string;
}

const EditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialImage = '',
}) => {
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

   
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setPassword('');
      setPreviewImage(initialImage);
      setSelectedFile(null);
    }
  }, [isOpen, initialName, initialImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      handleRemoveImage();
      return;
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
      toast.error('Please select a valid image (JPEG, PNG, GIF, or WebP)');
   
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
   
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
     
    };
    reader.readAsDataURL(file);
  };


const handleRemoveImage = () => {
  setSelectedFile(null);
  setPreviewImage('');
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
  
 
};

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    let imageToSend: string | null = null;
    
  
    if (selectedFile) {
      imageToSend = await convertToBase64(selectedFile);
    } 
    
    else if (!previewImage && initialImage) {
      imageToSend = null;
    }
    

    await onSave(name.trim(), password.trim(), imageToSend === undefined ? initialImage : imageToSend);
    onClose();
  } catch (error) {
    console.error('Save error:', error);
    toast.error('Failed to save changes');
  } finally {
    setIsLoading(false);
  }
};

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                disabled={isLoading}
              />
            </div>

      

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Profile Image</label>
              
              {/* Image Preview */}
              {previewImage && (
                <div className="mb-3 flex items-center gap-4">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-400 hover:text-red-300"
                    disabled={isLoading}
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                 value=''
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or GIF (Max 5MB)</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;