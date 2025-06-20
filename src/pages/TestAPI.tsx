import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export const TestAPI: React.FC = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userName: "",
    screenTitle: "",
    date: "",
    slot: "",
    location: "",
    package: "gold",
    price: "1999",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/send-booking-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success("Email sent successfully!");
      } else {
        toast.error(data.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error occurred");
      setResult({ error: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Test Email API
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test the Brevo email confirmation functionality
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) =>
                      handleInputChange("userEmail", e.target.value)
                    }
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.userName}
                    onChange={(e) =>
                      handleInputChange("userName", e.target.value)
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Screen Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.screenTitle}
                    onChange={(e) =>
                      handleInputChange("screenTitle", e.target.value)
                    }
                    placeholder="Baywatch Experience"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Slot *
                  </label>
                  <select
                    value={formData.slot}
                    onChange={(e) => handleInputChange("slot", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    required
                  >
                    <option value="">Select a time slot</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    required
                  >
                    <option value="">Select location</option>
                    <option value="Wadala">Wadala</option>
                    <option value="Dahisar">Dahisar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Package *
                  </label>
                  <select
                    value={formData.package}
                    onChange={(e) =>
                      handleInputChange("package", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    required
                  >
                    <option value="gold">Gold - ₹1,999</option>
                    <option value="diamond">Diamond - ₹2,999</option>
                    <option value="platinum">Platinum - ₹3,499</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="1999"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  {result.success ? (
                    <>
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      Success
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-red-500 mr-2" size={20} />
                      Error
                    </>
                  )}
                </h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
