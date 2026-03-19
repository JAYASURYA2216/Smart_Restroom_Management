import { motion } from "framer-motion";

const blobs = [
  { className: "bg-cyan-500/15", x: "10%", y: "20%", w: 520, h: 520, delay: 0 },
  { className: "bg-indigo-500/12", x: "70%", y: "10%", w: 520, h: 520, delay: 1.2 },
  { className: "bg-emerald-500/10", x: "40%", y: "65%", w: 580, h: 580, delay: 0.6 },
];

const dots = [
  { left: "12%", top: "24%", size: 2, delay: 0.2 },
  { left: "22%", top: "68%", size: 2, delay: 1.1 },
  { left: "41%", top: "32%", size: 3, delay: 0.6 },
  { left: "58%", top: "58%", size: 2, delay: 1.6 },
  { left: "74%", top: "26%", size: 3, delay: 0.9 },
  { left: "86%", top: "70%", size: 2, delay: 1.3 },
];

export function BackgroundAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full blur-3xl opacity-80 ${b.className}`}
          style={{ width: b.w, height: b.h, left: b.x, top: b.y }}
          animate={{
            x: ["0px", "30px", "0px"],
            y: ["0px", "-22px", "0px"],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}

      {dots.map((d, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-sky-200/40 blur-[0.5px]"
          style={{ width: d.size, height: d.size, left: d.left, top: d.top }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.65, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}
    </div>
  );
}

