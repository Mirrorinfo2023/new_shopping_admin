import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ProductStatusDialog from "@/components/product/product_status";

export default function BulkUploadPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <Button
        onClick={() => setDialogOpen(true)}
        className="flex gap-2 px-4 py-2 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
      >
        <Upload size={18} /> Bulk Upload / Update Status
      </Button>

      <ProductStatusDialog open={dialogOpen} setOpen={setDialogOpen} />
    </div>
  );
}
