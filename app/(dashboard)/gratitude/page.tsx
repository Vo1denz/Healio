"use client";

import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { NewEntryDialog } from "./new-entry-dialog";
import { motion } from "framer-motion";

export default function GratitudePage() {
  const { user } = useUser();
  const userId = user?.id || "";
  const entries = useQuery(api.journals.getEntries, userId ? { userId } : "skip");
  const addEntry = useMutation(api.journals.addEntry);

  const handleAddEntry = async (entry: { gratitude: string }) => {
    if (!userId) return;
    await addEntry({ userId, gratitude: entry.gratitude });
  };

  console.log('open ai : ',process.env.NEX_PUBLIC_OPENAI_API_KEY);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center min-h-screen  bg-gradient-to-b from-[#E5F4DD] to-[#D1E6C7] py-10"
    >
      <motion.div className="max-w-2xl w-full px-4">
        {/* Header */}
        <motion.div className="text-center mb-8">
          <h1 className="text-5xl font-handwritten text-[#314328] mb-2">
            My Gratitude Journal
          </h1>
          <p className="text-gray-700">
            Capture your daily blessings in a personal diary.
          </p>
        </motion.div>

        {/* Input Section */}
        <Card className="p-6 bg-white shadow-lg rounded-xl border">
          <NewEntryDialog onSave={handleAddEntry} />
        </Card>

        {/* Journal Entries */}
        <div className="mt-8 space-y-6">
          {entries === undefined ? (
            <p className="text-center">Loading entries...</p>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-[#efffe3] p-6 shadow-lg rounded-xl border border-[#425539] diary-page"
              >
                <p className="text-lg font-handwritten text-[#314328]">{entry.gratitude}</p>
                <div className="absolute top-3 left-3 text-xs text-gray-600">
                  {new Date(entry.date).toLocaleDateString()}
                </div>
                <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                  - {user?.fullName || "Anonymous"}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}