// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { BASE_URL } from "https://framer.com/m/VacanciesSection-aPqN.js";
import SingleCard from "https://framer.com/m/SingleCard-hpiu.js";
import ButtonBack from "https://framer.com/m/ButtonBack-gKLV.js";
import {
  checkLocale,
  getLocaleFromUrl,
} from "https://framer.com/m/funcs-hp22.js";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 *
 * @framerIntrinsicWidth 1032
 */

const dataTranslVacancySection = {
  preTitle: {
    en: "Remote work",
    ru: "Удаленная работа",
    es: "Trabajo remoto",
    pt: "Trabalho remoto",
  },
  errorMessage: {
    en: "There was a loading error. Please reload the page.",
    ru: "Произошла ошибка загрузки. Перегрузите страницу",
    es: "Se produjo un error al cargar. Por favor, recarga la página.",
    pt: "Ocorreu um erro de carregamento. Recarregue a página.",
  },
  loadMessage: {
    en: "Loading data...",
    ru: "Загрузка данных...",
    es: "Cargando datos...",
    pt: "Carregando dados...",
  },
  btnOtherVac: {
    en: "View other vacancies",
    ru: "Посмотреть другие вакансии",
    es: "Ver otras vacantes",
    pt: "Ver outras vagas",
  },
  btnSendRes: {
    en: "Send resume",
    ru: "Отправить резюме",
    es: "Enviar currículum",
    pt: "Enviar currículo",
  },
};
function getSerchIndexArray(arr, locale) {
  let index = arr.findIndex((el) => el.lang === locale);
  return index < 0 ? 0 : index;
}
export default function VacancySection(props) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [slug, setSlug] = (useState < string) | (null > null);
  const [isMobile, setIsMobile] = useState(false);
  const [locale, setLocale] = useState("en");
  const [vacancyContent, setVacancyContent] = useState("Нет данных");

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    const currentUrl = window.location.href;
    const loc = getLocaleFromUrl(currentUrl);
    if (loc && checkLocale(loc)) setLocale(loc);
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

  useEffect(() => {
    if (vacancy?.vacancy_contents && locale) {
      let index = getSerchIndexArray(vacancy.vacancy_contents, locale);
      console.log(index);
      setVacancyContent(vacancy?.vacancy_contents[index].content);
    }
  }, [locale, vacancy]);

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
          <div>{dataTranslVacancySection.errorMessage[locale]}</div>
        ) : isLoading ? (
          <div>{dataTranslVacancySection.loadMessage[locale]}</div>
        ) : (
          vacancy && (
            <>
              <SingleCard
                locale={locale}
                name={vacancy.name}
                department={vacancy.department}
              />
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
                  {dataTranslVacancySection.preTitle[locale]}
                </div>
                <h3 style={{ fontSize: 32, margin: "16px 0" }}>
                  Mediacube is looking for a {vacancy.name}!
                </h3>
                <div
                  className="content_single_vacancy"
                  dangerouslySetInnerHTML={{
                    __html: vacancyContent || "<p>Нет данных</p>",
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
                  title={dataTranslVacancySection.btnOtherVac[locale]}
                  href="/"
                  withArrow={true}
                />
                <ButtonBack
                  title={dataTranslVacancySection.btnSendRes[locale]}
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
