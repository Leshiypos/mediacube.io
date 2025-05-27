// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { BASE_URL } from "https://framer.com/m/VacanciesSection-aPqN.js";
import SingleCard from "https://framer.com/m/SingleCard-hpiu.js";
import ButtonBack from "https://framer.com/m/ButtonBack-gKLV.js";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 *
 * @framerIntrinsicWidth 1032
 */
export default function VacancySection(props) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [slug, setSlug] = (useState < string) | (null > null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const segments = url.pathname.split("/");
    const last = segments.pop() || segments.pop(); // на случай "/" на конце
    setSlug(last || null);
  }, []);
  useEffect(() => {
    if (slug) {
      setError(false);
      setLoading(true);
      fetch(`${BASE_URL}/${slug}`)
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject(`Ошибка ${response.status}`)
        )
        .then((data) => {
          setVacancy(data.data);
          setLoading(false);
          console.log(data.data);
        })
        .catch((e) => {
          console.log(e);
          setError(true);
        });
    }
  }, [slug]);

  return (
    <>
      <style>{`
            @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
            .content_single_vacancy *{
                margin:0;
                padding: 0;
                
                font-size: 16px;
            }
            .content_single_vacancy ul {
                list-style-type: decimal ;
                font-weight: 200 ;
                margin-left: 15px;
            }
            .content_single_vacancy p {
                font-weight: 200 ;
            }
            .content_single_vacancy h2 {
                font-size: 20px ;
                margin-bottom: 8px;
            }
            `}</style>
      <div
        style={{
          fontFamily: "'SF Pro Display', sans-serif",
          maxWidth: 1032,
        }}
      >
        {isError ? (
          <div>Произошла ошибка загрузки. Перегрузите страницу</div>
        ) : isLoading ? (
          <div>Загрузка данных</div>
        ) : (
          vacancy && (
            <>
              <SingleCard name={vacancy.name} department={vacancy.department} />
              <div style={{ marginTop: isMobile ? 20 : 80 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    color: "rgba(64, 57, 255, 1)",
                    fontWeight: 600,
                  }}
                >
                  <img
                    src="https://framerusercontent.com/images/Gi7WIMAxKV3wB8smlLm0DY7WMPQ.png"
                    alt="icon"
                  />
                  Удаленная работа
                </div>
                <h3 style={{ fontSize: 32, margin: "16px 0" }}>
                  Mediacube is looking for a {vacancy.name}!
                </h3>
                <div
                  className="content_single_vacancy"
                  dangerouslySetInnerHTML={{
                    __html:
                      vacancy?.vacancy_contents?.[0]?.content ||
                      "<p>Нет данных</p>",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 32,
                }}
              >
                <ButtonBack
                  title={"Посмотреть другие вакансии"}
                  href="/"
                  withArrow={true}
                />
                <ButtonBack
                  title={"Отправить резюме"}
                  href="#"
                  withArrow={false}
                  isDark={true}
                />
              </div>
            </>
          )
        )}
      </div>
    </>
  );
}
