'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const CancelProduct = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-800 dark:text-white p-6 sm:p-8">
      <h1 className="text-4xl font-bold mb-4">Coming Soon 🚀</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
        The Cancel Product feature is under development.
      </p>
      <button
        onClick={() => router.push('/products')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Back to Products
      </button>
    </div>
  );
};

export default CancelProduct;
