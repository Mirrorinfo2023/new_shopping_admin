// src/pages/vendors/[id].jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditVendor() {
    const router = useRouter();
    const { id } = router.query;

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchVendor = async () => {
            try {
                const res = await fetch(`/api/vendors/${id}`);
                const data = await res.json();
                if (data.success) {
                    setVendor(data.vendor);
                }
            } catch (err) {
                console.error("Failed to fetch vendor:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/vendors/update/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vendor),
            });

            const data = await res.json();
            if (data.success) {
                alert("Vendor updated successfully!");
                router.push("/vendor");
            } else {
                alert("Failed to update vendor");
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!vendor) return <p className="p-6">Vendor not found</p>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Edit Vendor</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block font-medium">Vendor Name</label>
                    <input
                        type="text"
                        name="vendorName"
                        value={vendor.vendorName || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={vendor.businessName || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={vendor.email || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={vendor.phone || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                {/* New Fields */}
                <div>
                    <label className="block font-medium">Street</label>
                    <input
                        type="text"
                        name="street"
                        value={vendor.address?.street || ""}
                        onChange={(e) =>
                            setVendor((prev) => ({
                                ...prev,
                                address: { ...prev.address, street: e.target.value },
                            }))
                        }
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">City</label>
                    <input
                        type="text"
                        name="city"
                        value={vendor.address?.city || ""}
                        onChange={(e) =>
                            setVendor((prev) => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value },
                            }))
                        }
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">State</label>
                    <input
                        type="text"
                        name="state"
                        value={vendor.address?.state || ""}
                        onChange={(e) =>
                            setVendor((prev) => ({
                                ...prev,
                                address: { ...prev.address, state: e.target.value },
                            }))
                        }
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={vendor.address?.pincode || ""}
                        onChange={(e) =>
                            setVendor((prev) => ({
                                ...prev,
                                address: { ...prev.address, pincode: e.target.value },
                            }))
                        }
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={vendor.address?.country || ""}
                        onChange={(e) =>
                            setVendor((prev) => ({
                                ...prev,
                                address: { ...prev.address, country: e.target.value },
                            }))
                        }
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>


                <div>
                    <label className="block font-medium">GST Number</label>
                    <input
                        type="text"
                        name="gstNumber"
                        value={vendor.gstNumber || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Aadhar Number</label>
                    <input
                        type="text"
                        name="aadharNumber"
                        value={vendor.aadharNumber || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">PAN Number</label>
                    <input
                        type="text"
                        name="panNumber"
                        value={vendor.panNumber || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        name="status"
                        value={vendor.status || "active"}
                        onChange={handleChange}
                        className="border px-3 py-2 w-full rounded"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                {/* <div>
                    <label className="block font-medium">Verified</label>
                    <select
                        name="verified"
                        value={vendor.verified ? "true" : "false"}
                        onChange={(e) =>
                            setVendor((prev) => ({
                                ...prev,
                                verified: e.target.value === "true",
                            }))
                        }
                        className="border px-3 py-2 w-full rounded"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div> */}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Vendor
                </button>
            </form>
        </div>
    );
}
