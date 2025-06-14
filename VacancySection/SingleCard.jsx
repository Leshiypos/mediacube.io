// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer";
import { motion } from "framer-motion";
import ButtonBack from "https://framer.com/m/ButtonBack-gKLV.js";
import { useState, useEffect, useMemo } from "react";

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */

const lengSingleCard = {
  btnAllTitle: {
    en: "All vacancies",
    ru: "Все вакансии",
    es: "Todas las vacantes",
    pt: "Todas as vagas",
  },
  btnShareTitle: {
    en: "Share Resume",
    ru: "Поделиться Резюме",
    es: "Compartir currículum",
    pt: "Compartilhar currículo",
  },
  imgAltText: {
    en: "Didn't find a suitable vacancy?",
    ru: "Не нашли подходящую вакансию?",
    es: "¿No encontraste una vacante adecuada?",
    pt: "Não encontrou uma vaga adequada?",
  },
};
export default function SingleCard(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const { name, department, locale, is_remote } = props;
  console.log(is_remote);

  return (
    <div
      style={isMobile ? { ...styles.wrap, flexFlow: "column" } : styles.wrap}
    >
      <div
        style={
          isMobile
            ? {
                ...styles.leftColumn,
                gap: 20,
                padding: 20,
                width: "100%",
              }
            : styles.leftColumn
        }
      >
        <div>
          <div
            style={{
              color: "rgb(64, 57, 255)",
              paddingBottom: 8,
              fontSize: 14,
            }}
          >
            {!is_remote && department}
          </div>
          {is_remote && (
            <div
              style={{
                textTransform: "uppercase",
                color: "#4039FF",
                marginBottom: 8,
              }}
            >
              В архиве с 9 марта 2024 г.
            </div>
          )}
          <h5 style={styles.title}>{name}</h5>
          {is_remote && (
            <>
              {" "}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  color: "#C40B08",
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 5,
                }}
              >
                <div style={{ marginBottom: -5 }}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_222_1721)">
                      <path
                        d="M12 14V8"
                        stroke="#C40B08"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <circle cx="12" cy="16.25" r="0.75" fill="#C40B08" />
                      <path
                        d="M11.4229 3.58334C11.6635 3.16667 12.2426 3.14042 12.5254 3.50522L12.5771 3.58334L21.165 18.4583C21.4216 18.9028 21.1011 19.4583 20.5879 19.4583H3.41211C2.93084 19.4583 2.61833 18.9697 2.79297 18.5423L2.83496 18.4583L11.4229 3.58334Z"
                        stroke="#C40B08"
                        stroke-width="1.5"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_222_1721">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>К сожелению, вакансия закрыта</div>
              </div>
              <div
                style={{
                  color: "#636884",
                  lineHeight: "120%",
                  fontSize: 14,
                  marginBottom: 40,
                }}
              >
                Но если вы подходите на эту роль, оставьте свое резюме и мы
                свяжемся с вами, когда у нас появится подобная вакансия
              </div>
            </>
          )}
        </div>
        <div
          style={
            isMobile
              ? {
                  display: "flex",
                  gap: 16,
                  justifyContent: "space-between",
                }
              : { display: "flex", gap: 16 }
          }
        >
          <ButtonBack
            title={lengSingleCard.btnAllTitle[locale]}
            href="/"
            withArrow={true}
          />
          <ButtonBack
            title={lengSingleCard.btnShareTitle[locale]}
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
          alt={lengSingleCard.imgAltText[locale]}
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
