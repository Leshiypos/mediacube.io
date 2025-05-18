// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer";
import { motion } from "framer-motion";
import ButtonBack from "https://framer.com/m/ButtonBack-gKLV.js";

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function SingleCard(props) {
  const { name, department } = props;

  return (
    <div style={styles.wrap}>
      <div style={styles.leftColumn}>
        <div>
          <div
            style={{
              color: "rgb(64, 57, 255)",
              paddingBottom: 8,
              fontSize: 14,
            }}
          >
            {department}
          </div>
          <h5 style={styles.title}>{name}</h5>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <ButtonBack title={"Все вакансии"} href="/" withArrow={true} />
          <ButtonBack
            title={"Поделиться Резюме"}
            href="#"
            withArrow={false}
            isDark={true}
          />
        </div>
      </div>
      <div style={styles.imgWrap}>
        <img
          style={styles.img}
          src="https://framerusercontent.com/images/EhMggQXwRTRthqSEoq9ci5T2c0.png"
          alt="Не нашли подходящую вакансию?"
        />
      </div>
    </div>
  );
}
const styles = {
  wrap: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 20,
    padding: 0,
    display: "flex",
    justifyContent: "stretch",
    marginTop: 24,
    alignItems: "center",
    overflow: "hidden",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 6,
    padding: "40px 0 40px 40px",
    gap: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    color: "rgba(99, 104, 132, 1)",
  },
  imgWrap: { flex: 5, height: "100%" },
  img: {
    width: "100%",
    transform: "scale(1.3)",
    height: "100%",
    overflow: "visible",
  },
};
