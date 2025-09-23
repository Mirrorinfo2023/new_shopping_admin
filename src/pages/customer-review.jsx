import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Download, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Calendar,
  User,
  Package,
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://secure1.mirrorhub.in/api/reviews/getallreviews"
      );
      if (response.data) {
        const mapped = response.data.map((r, idx) => ({
          id: r._id,
          product: r.productId?.name || "Product not found",
          customer: r.customerId?.name || "Unknown Customer",
          rating: r.rating,
          review: r.comment,
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-GB")
            : "N/A",
          images: r.images || [],
          status: r.status || "published"
        }));
        setReviews(mapped);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const exportCSV = () => {
    const csv = [
      ["Review ID", "Product", "Customer", "Rating", "Review", "Date", "Status"],
      ...reviews.map((r) => [
        r.id,
        r.product,
        r.customer,
        r.rating,
        r.review,
        r.date,
        r.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `customer_reviews_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = reviews.filter(
    (r) =>
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.review.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm font-medium">({rating})</span>
      </div>
    );
  };

  // Statistics
  const stats = {
    total: reviews.length,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    withImages: reviews.filter(r => r.images.length > 0).length,
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
            <p className="text-gray-600 mt-1">Manage and analyze customer feedback</p>
          </div>
          <Button onClick={exportCSV} className="bg-green-600 hover:bg-green-700">
            <Download size={18} className="mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                  <Star size={24} className="text-yellow-600 fill-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.fiveStar}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <Star size={24} className="text-green-600 fill-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.withImages}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Package size={24} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by product, customer, or review..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              <div className="flex gap-3 flex-wrap">
                <select className="border rounded-lg px-3 py-2 text-sm min-w-[140px]">
                  <option>All Products</option>
                </select>
                
                <select className="border rounded-lg px-3 py-2 text-sm min-w-[140px]">
                  <option>All Customers</option>
                </select>
                
                <select className="border rounded-lg px-3 py-2 text-sm min-w-[140px]">
                  <option>All Ratings</option>
                  <option>5 Stars</option>
                  <option>4 Stars</option>
                  <option>3 Stars</option>
                  <option>2 Stars</option>
                  <option>1 Star</option>
                </select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Reviews ({filtered.length})</span>
              {loading && (
                <div className="flex items-center gap-2 text-sm font-normal">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Loading...
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Review</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Rating</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>No reviews found</p>
                        <p className="text-sm mt-1">Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((review, idx) => (
                      <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="max-w-[300px]">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                              {review.review || "No comment"}
                            </p>
                            {review.images.length > 0 && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {review.images.length} image{review.images.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{review.product}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{review.customer}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {renderStars(review.rating)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            {review.date}
                          </div>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(review)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <Eye size={16} />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product</label>
                    <p className="text-gray-900 font-medium">{selectedReview.product}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer</label>
                    <p className="text-gray-900 font-medium">{selectedReview.customer}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedReview.rating)}
                      <Badge className={getRatingColor(selectedReview.rating)}>
                        {selectedReview.rating} Star{selectedReview.rating !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-gray-900 font-medium">{selectedReview.date}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Review Comment</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedReview.review || "No comment provided"}</p>
                </div>
              </div>

              {selectedReview.images.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Images ({selectedReview.images.length})</label>
                  <div className="mt-2 flex gap-3 flex-wrap">
                    {selectedReview.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}