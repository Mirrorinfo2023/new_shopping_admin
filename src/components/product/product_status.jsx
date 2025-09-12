"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios"; // Using axios to call your API

export default function ProductStatusDialog({ productIds }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    if (!status) return;
    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const res = await axios.post("/api/products/update-status", {
        productIds: Array.isArray(productIds) ? productIds : [productIds],
        status,
      });

      if (res.data.success) {
        alert("Status updated successfully!");
        setOpen(false);
        window.location.reload(); // refresh to show updated status
      } else {
        alert("Failed to update status: " + (res.data.message || ""));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Change Status</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Product Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <label className="text-sm font-medium">Select Status</label>
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!status || loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
