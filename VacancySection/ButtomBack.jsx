// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer";
import { motion } from "framer-motion";

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ButtonBack(props) {
  const { title } = props;

  return (
    <motion.button
      whileHover={{
        backgroundColor: "rgb(64, 57, 255)",
        color: "rgba(255, 255, 255, 1)",
      }}
      style={{
        ...styles.button,
        backgroundColor: "rgba(64, 57, 255, 0.08)",
        color: "rgba(64, 57, 255, 1)",
        fontWeight: 600,
      }}
    >
      <span style={{ marginRight: 14 }}>{"<"}</span>
      {title}
    </motion.button>
  );
}

const styles = {
  button: {
    backgroundColor: "rgba(64, 57, 255, 1)",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    color: "rgba(255, 255, 255, 1)",
    width: "fit-content",
    cursor: "pointer",
  },
};
