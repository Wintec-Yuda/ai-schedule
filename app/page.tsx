"use client";

import { useState } from "react";
import axios from "axios";
import { CircularProgress, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Home() {
  const [plan, setPlan] = useState("");
  const [schedule, setSchedule] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("indonesia");
  const [formError, setFormError] = useState("");

  const generateSchedule = async () => {
    if (!plan) {
      setFormError("Please enter your planned activities.");
      return;
    }
    setFormError("");
    setLoading(true);
    setSchedule(null);
    try {
      const res = await axios.post("/api/generate-schedule", {
        plan,
        language,
      });
      setSchedule(res.data.schedule);
    } catch {
      setSchedule(
        "Something went wrong while generating your schedule. We're working on it! Please try again soon."
      );
    }
    setLoading(false);
  };

  const resetForm = () => {
    setPlan("");
    setSchedule(null);
    setFormError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6 bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-600"
        >
          {!schedule ? (
            <>
              <Typography
                variant="h4"
                className="text-center text-blue-400 font-bold"
              >
                AI Scheduler 🧠✨
              </Typography>
              <Typography className="text-gray-400 text-center">
                Enter your planned activities, and let AI create an optimal
                daily schedule.
              </Typography>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <textarea
                  placeholder="Rencana Kegiatan"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full p-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                {formError && (
                  <p className="text-red-500 text-sm mt-2">{formError}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-4 mt-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="indonesia">Bahasa Indonesia</option>
                  <option value="english">English</option>
                </select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={generateSchedule}
                  disabled={loading}
                  className="w-full p-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {loading ? (
                    <CircularProgress size={24} color="primary" />
                  ) : (
                    "Create Schedule"
                  )}
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-gray-800/80 border border-blue-400 rounded-xl shadow-md"
              >
                <Typography variant="h6" className="text-blue-300 mb-4">
                  Your Daily Schedule:
                </Typography>
                <MarkdownPreview
                  source={schedule}
                  style={{
                    padding: 16,
                    background: "transparent",
                    color: "#d4d4d8",
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={resetForm}
                  className="w-full p-2 mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
                >
                  Reset
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
