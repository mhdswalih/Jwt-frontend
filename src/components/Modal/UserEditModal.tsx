import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser, userEdit } from '../../Redux/slices/loginSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/redux-store.';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, image: string) => void;
  initialName?: string;
}

const EditUserModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialName = '' }) => {
  const [name, setName] = useState(initialName);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const user = useSelector((state: RootState) => state.login.user);
  const id = user._id;
  const dispatch = useDispatch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert image file to base64 string
      let imageBase64 = '';
      if (selectedFile) {
        imageBase64 = await convertToBase64(selectedFile);
      }

      // Dispatch with regular object (not FormData)
      const resultAction = await dispatch(userEdit({ 
        id, 
        name, 
        image: imageBase64 
      }) as any)

      if (userEdit.fulfilled.match(resultAction)) {
        dispatch(updateUser(resultAction.payload.user));
        onSave(name, imageBase64 || previewImage);
        onClose();
        toast.success(resultAction.payload.message || 'User updated successfully');
      } else {
        const errorMessage = resultAction.payload?.message || 'Name already exists';
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unexpected error occurred';
      toast.error(errorMessage);
    }
  };

 
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          
          <input
            className="w-full border border-gray-300 rounded p-2 mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <input
            className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
            id="image"
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
          />

          {previewImage && (
            <div className="mb-4">
              <img src={previewImage} alt="Preview" className="max-h-40 rounded" />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;