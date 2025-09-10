"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export default function Legend() {
  const { isDark } = useTheme();
  return (
    <motion.div
      className="absolute bottom-4 right-4 z-99 hidden lg:block max-w-[280px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div
        className={`backdrop-blur-md rounded-lg p-3 border transition-colors shadow-lg ${
          isDark
            ? "bg-black/40 border-slate-700/50 text-white"
            : "bg-white/95 border-slate-300/50 text-slate-900"
        }`}
      >
        <h3 className="font-semibold mb-2 text-sm">Latency Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-300" : "text-slate-800"
              }`}
            >
              &lt; 50ms - Excellent
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-300" : "text-slate-800"
              }`}
            >
              50-150ms - Good
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-300" : "text-slate-800"
              }`}
            >
              {" "}
              150ms - Poor
            </span>
          </div>
        </div>

        <div
          className={`mt-3 pt-2 border-t ${
            isDark ? "border-slate-700" : "border-slate-300"
          }`}
        >
          <h4 className="font-medium mb-2 text-sm">Markers</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-slate-300" : "text-slate-800"
                }`}
              >
                Crypto Exchanges
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-slate-300" : "text-slate-800"
                }`}
              >
                Cloud Regions
              </span>
            </div>
          </div>
        </div>

        <div
          className={`mt-2 pt-2 border-t ${
            isDark ? "border-slate-700" : "border-slate-300"
          }`}
        >
          <div
            className={`text-xs font-medium ${
              isDark ? "text-slate-400" : "text-slate-700"
            }`}
          >
            <div>Live network monitoring</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
