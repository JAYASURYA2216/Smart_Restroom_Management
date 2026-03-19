import { motion } from "framer-motion";
import { Fan, RotateCcw, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type ControlsProps = {
  cleaningActive: boolean;
  ventilationOn: boolean;
  onTriggerCleaning: () => void;
  onToggleExhaustFan: () => void;
  onReset: () => void;
};

const GlowButton = ({
  children,
  onClick,
  disabled,
  icon,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold
                 bg-white/5 border border-white/10 text-slate-100
                 shadow-glow transition
                 hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
    >
      <span className="absolute inset-0 rounded-xl bg-cyan-400/10 opacity-0 hover:opacity-100 blur-[2px] transition" />
      <span className="relative flex items-center gap-2">
        <span className="text-cyan-200">{icon}</span>
        <span>{children}</span>
      </span>

      {/* click feedback spark */}
      <motion.span
        aria-hidden
        className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.6)] opacity-0"
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 3, opacity: 0 }}
      />
    </motion.button>
  );
};

export function Controls({
  cleaningActive,
  ventilationOn,
  onTriggerCleaning,
  onToggleExhaustFan,
  onReset,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <GlowButton
        onClick={onTriggerCleaning}
        disabled={cleaningActive}
        icon={<Sparkles size={18} />}
      >
        Trigger Cleaning
      </GlowButton>

      <GlowButton
        onClick={onToggleExhaustFan}
        icon={<Fan size={18} />}
      >
        Toggle Exhaust Fan ({ventilationOn ? "ON" : "OFF"})
      </GlowButton>

      <GlowButton onClick={onReset} icon={<RotateCcw size={18} />}>
        Reset System
      </GlowButton>
    </div>
  );
}

