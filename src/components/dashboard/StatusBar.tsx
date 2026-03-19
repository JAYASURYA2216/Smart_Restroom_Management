import { motion } from "framer-motion";
import { Fan, ShieldAlert, Sparkles } from "lucide-react";

export function StatusBar({
  cleaningActive,
  ventilationOn,
  showAlert,
}: {
  cleaningActive: boolean;
  ventilationOn: boolean;
  showAlert: boolean;
}) {
  return (
    <header className="relative z-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.55)]" />
            <div className="text-xs font-semibold tracking-widest text-slate-300/80 uppercase">
              LIVE
            </div>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-200">
              Hygieniq Dashboard
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`glass rounded-full px-4 py-2 flex items-center gap-2 ${
              cleaningActive ? "border-cyan-300/25" : "border-white/10"
            }`}
          >
            <span className={cleaningActive ? "text-cyan-200" : "text-slate-300/80"}>
              <Sparkles size={16} />
            </span>
            <span className="text-sm font-semibold text-slate-100">
              Cleaning {cleaningActive ? "Active" : "Idle"}
            </span>

            {cleaningActive ? (
              <motion.span
                className="h-2 w-2 rounded-full bg-cyan-300"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            ) : null}
          </div>

          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 border-white/10">
            <span className={ventilationOn ? "text-cyan-200" : "text-slate-300/80"}>
              <Fan size={16} />
            </span>
            <span className="text-sm font-semibold text-slate-100">
              Ventilation {ventilationOn ? "ON" : "OFF"}
            </span>
          </div>

          {showAlert ? (
            <motion.div
              className="glass rounded-full px-4 py-2 flex items-center gap-2 border-red-400/20"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.0, repeat: Infinity }}
            >
              <span className="text-red-200">
                <ShieldAlert size={16} />
              </span>
              <span className="text-sm font-semibold text-red-100">Hygiene Alert</span>
            </motion.div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

