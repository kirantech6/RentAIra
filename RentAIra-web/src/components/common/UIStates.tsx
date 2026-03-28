import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF4D5A]"></div>
  </div>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-center items-center text-gray-500 min-h-[100px]">
    <p>{message}</p>
  </div>
);
