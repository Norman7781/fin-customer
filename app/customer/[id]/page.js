"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerDetailPage({ params }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    memberNumber: "",
    interests: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customer/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        setFormData({
          name: data.name,
          dateOfBirth: data.dateOfBirth.split("T")[0],
          memberNumber: data.memberNumber,
          interests: data.interests,
        });
      } else {
        console.error("Customer not found");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/customer/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCustomer();
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`/api/customer/${params.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Customer Not Found
          </h1>
          <Link
            href="/customer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Customer List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link
          href="/customer"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          ← Back to Customer List
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Details</h1>
          <div className="space-x-2">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editing ? "Cancel Edit" : "Edit"}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Number
              </label>
              <input
                type="number"
                value={formData.memberNumber}
                onChange={(e) =>
                  setFormData({ ...formData, memberNumber: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
                placeholder="e.g., movies, football, gym, gaming"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Customer
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-xl font-semibold text-gray-800">
                      {customer.name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Date of Birth:
                    </span>
                    <p className="text-lg text-gray-800">
                      {new Date(customer.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Membership Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">
                      Member Number:
                    </span>
                    <p className="text-xl font-semibold text-blue-600">
                      #{customer.memberNumber}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Customer ID:
                    </span>
                    <p className="text-sm text-gray-500 font-mono">
                      {customer._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Interests
              </h3>
              <p className="text-gray-800">
                {customer.interests || "No interests specified"}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Account Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {customer.memberNumber}
                  </p>
                  <p className="text-sm text-gray-600">Member Number</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.floor(
                      (new Date() - new Date(customer.dateOfBirth)) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Age</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
