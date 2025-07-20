"use client";

import { motion } from "framer-motion";
import { Globe, Activity } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mb-6"
        >
          <Globe className="w-16 h-16 text-cyan-400 mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Latency Topology Visualizer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 mb-6"
        >
          Initializing global network visualization...
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 rounded-full mx-auto"
          style={{ maxWidth: "200px" }}
        />

        <div className="flex items-center justify-center gap-2 mt-4">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-sm text-slate-400">
            Connecting to global network...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
