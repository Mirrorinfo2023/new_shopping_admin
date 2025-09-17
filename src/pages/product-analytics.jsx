import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download,
  Package
} from 'lucide-react';
import ProductChart from '../components/common/ProductChart';

const ProductGraphs = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleExport = () => {
    alert('Exporting data to CSV...');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-7 w-7 text-purple-500" />
            Product Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive visualization of e-commerce product performance
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRefresh} 
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            
            <button 
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-sm text-blue-700 dark:text-blue-400">Total Products</div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-300 mt-1">1,250</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">+32 this month</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-sm text-green-700 dark:text-green-400">Active Products</div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-300 mt-1">1,100</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">88% of total</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="text-sm text-yellow-700 dark:text-yellow-400">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mt-1">120</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">9.6% of total</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="text-sm text-red-700 dark:text-red-400">Out of Stock</div>
          <div className="text-2xl font-bold text-red-800 dark:text-red-300 mt-1">30</div>
          <div className="text-xs text-red-600 dark:text-red-400 mt-1">2.4% of total</div>
        </div>
      </div>

      {/* Product Analytics Chart */}
      <ProductChart />

      {/* Top Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Top Performing Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Smartphone X10</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">SKU: SPX-1000</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">Electronics</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">2,450</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹24,50,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">+15.2%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Men's Leather Jacket</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">SKU: MLJ-500</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">Apparel</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">1,980</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹19,80,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">+12.8%</td>
              </tr>
              {/* Add more e-commerce products here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductGraphs;
