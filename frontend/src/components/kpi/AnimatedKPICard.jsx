import { motion } from "framer-motion";

function AnimatedKPICard({ title, value, icon, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="kpi-card"
    >
      <div className="kpi-card-header">
        <span className="kpi-icon">{icon}</span>
        <span className="kpi-title">{title}</span>
      </div>

      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="kpi-value"
      >
        {value}
      </motion.div>

      {subtitle && (
        <div className="kpi-subtitle">
          {subtitle}
        </div>
      )}
    </motion.div>
  );
}

export default AnimatedKPICard;