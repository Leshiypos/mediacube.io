// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { getLocaleFromUrl } from "https://framer.com/m/funcs-hp22.js"

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 *
 * @framerIntrinsicWidth 1032
 */
export const BASE_URL = "https://mcpay.mc-team.workers.dev/api/client/vacancies"

const styles = {
    SendResume: {
        wrap: {
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: 20,
            padding: 0,
            display: "flex",
            justifyContent: "space-around",
            marginTop: 24,
        },
        leftColumn: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 6,
            padding: "24px 0 24px 24px",
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
            marginBottom: 10,
        },
        button: {
            backgroundColor: "rgba(64, 57, 255, 1)",
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            color: "rgba(255, 255, 255, 1)",
            width: "fit-content",
            cursor: "pointer",
        },
        imgWrap: { flex: 5 },
        img: { width: "100%" },
    },
    VacanciesSection: {
        wrap: {
            maxWidth: 1032,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexFlow: "column wrap",
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "'SF Pro Display', sans-serif",
        },
        title: {
            textAlign: "center",
            fontSize: 40,
            margin: 0,
            marginBottom: 8,
        },
        description: {
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
            maxWidth: 800,
            color: "rgba(99, 104, 132, 1)",
            fontSize: 20,
            textAlign: "center",
        },
        wrapContent: { display: "flex", marginTop: 80, gap: 24 },
        searchRezTitle: {
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 8,
        },
        searchRezContent: {
            display: "flex",
            flexDirection: "column",
            gap: 8,
        },
        notFound: {
            fontSize: 16,
            color: "rgba(99, 104, 132, 1)",
        },
    },
    Search: {
        wrap: { width: "100%" },
        title: {
            fontSize: 16,
            color: "rgba(99, 104, 132, 1)",
            paddingBottom: 8,
        },
        searchWrap: {
            width: "100%",
            padding: 12,
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: 8,
            display: "flex",
        },
    },
    JobCard: {
        wrap: {
            margin: 0,
            listStyleType: "none",
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 1)",
            width: "100%",
        },
        categoty: {
            color: "rgba(64, 57, 255, 1)",
            paddingBottom: 8,
            fontSize: 14,
        },
        title: { paddingBottom: 4, fontSize: 20, fontWeight: 600 },
        description: { fontSize: 16, color: "rgba(99, 104, 132, 1)" },
        link: {
            display: "block",
            color: "inherit",
            textDecoration: "none",
            padding: 24,
        },
    },
    FilterItem: {
        label: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: 14,
        },
        input: { display: "none" },
        span: {
            display: "block",
            width: 20,
            height: 20,
            borderRadius: 6,
            padding: 5,
            border: "1px solid rgba(64, 57, 255, 1)",
        },
        checkSpan: {
            backgroundColor: "rgba(64, 57, 255, 1)",
            width: "100%",
            height: "100%",
            borderRadius: 3,
        },
    },
    FilterForm: {
        wrap: {
            display: "flex",
            flexFlow: "column nowrap",
            gap: 10,
            marginTop: 24,
        },
        title: { fontSize: 16, color: "rgba(99, 104, 132, 1)" },
        form: { display: "flex", flexFlow: "column nowrap", gap: 10 },
    },
}

const dataTransl = {
    titleTrue: {
        en: "open positions",
        ru: "открытых позиций",
        es: "puestos vacantes",
        pt: "vagas disponíveis",
    },
    titleFalse: {
        en: "No open positions",
        ru: "Нет открытых позиций",
        es: "No hay puestos vacantes",
        pt: "Nenhuma vaga aberta",
    },
    description: {
        en: "We grow by 30% per year, so we always have open positions. We are looking for talented specialists in various departments: from marketing to IT",
        ru: "За год мы вырастаем на 30%, поэтому у нас всегда есть открытые вакансии.Ищем талантливых специалистов в разныеотделы: от маркетинга до IT",
        es: "Crecemos un 30 % anual, por lo que siempre tenemos vacantes. Buscamos especialistas con talento en diversos departamentos: desde marketing hasta TI.",
        pt: "Crescemos 30% ao ano, por isso sempre temos vagas em aberto. Buscamos especialistas talentosos em diversos departamentos: de marketing a TI.",
    },
    notFound: {
        en: "No results found matching your criteria",
        ru: "Не найдено результатов, соответствующих вашим критериям",
        es: "No se encontraron resultados que coincidan con tus criterios",
        pt: "Nenhum resultado encontrado correspondendo aos seus critérios",
    },
    totalTitle: {
        en: "Search results:",
        ru: "Результаты поиска:",
        es: "Resultados de la búsqueda:",
        pt: "Resultados da pesquisa:",
    },
}
function checkLocale(leng) {
    const languagesPos = ["ru", "pt", "es", "en"]
    return languagesPos.includes(leng)
}

export default function VacanciesSection(props) {
    const [vacancies, setVacancies] = useState(null)
    const [selectedDepartment, setSelectedDepartment] = useState("allCommads")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchInitial, setSearchInitial] = useState(null)
    const [filteredVacancies, setFilteredVacancies] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [locale, setLocale] = useState("en")

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768)
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    useEffect(() => {
        const currentUrl = window.location.href
        const loc = getLocaleFromUrl(currentUrl)
        console.log(currentUrl)
        console.log(loc)
        console.log(checkLocale(loc))
        if (loc && checkLocale(loc)) setLocale(loc)
    }, [])

    useEffect(() => {
        fetch(BASE_URL)
            .then((response) =>
                response.ok
                    ? response.json()
                    : Promise.reject(`Ошибка ${response.status}`)
            )
            .then((data) => {
                setVacancies(data.data)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])

    useEffect(() => {
        setSearchQuery("")
        if (selectedDepartment === "allCommads") {
            setFilteredVacancies(vacancies)
            setSearchInitial(vacancies)
        } else {
            const filtered = vacancies.filter(
                (v) => v.department === selectedDepartment
            )
            setFilteredVacancies(filtered)
            setSearchInitial(filtered)
        }
    }, [selectedDepartment, vacancies])

    const departments = useMemo(() => {
        if (vacancies) {
            let departments = {}
            for (let vacancy of vacancies) {
                departments[vacancy.department]
                    ? ++departments[vacancy.department]
                    : (departments[vacancy.department] = 1)
            }
            return departments
        }
    }, [vacancies])
    console.log(vacancies)
    return (
        <>
            <style>{`
            @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
            `}</style>
            <div style={styles.VacanciesSection.wrap}>
                <h2 style={styles.VacanciesSection.title}>
                    {filteredVacancies?.length
                        ? `${filteredVacancies?.length} ${dataTransl.titleTrue[locale]}`
                        : dataTransl.titleFalse[locale]}
                </h2>
                <div style={styles.VacanciesSection.description}>
                    {dataTransl.description[locale]}
                </div>
                <div
                    style={
                        isMobile
                            ? {
                                  ...styles.VacanciesSection.wrapContent,
                                  flexFlow: "row wrap",
                                  marginTop: 30,
                              }
                            : styles.VacanciesSection.wrapContent
                    }
                >
                    <div
                        style={
                            isMobile
                                ? { width: "100%", minWidth: 328 }
                                : { minWidth: 328 }
                        }
                    >
                        <Search
                            searchQuery={searchQuery}
                            setFunction={setSearchQuery}
                            searchInitial={searchInitial}
                            setFilteredVacancies={setFilteredVacancies}
                            locale={locale}
                        />
                        <FilterForm
                            departments={departments}
                            selected={selectedDepartment}
                            onChange={setSelectedDepartment}
                            locale={locale}
                        />
                    </div>
                    <div>
                        <div style={styles.VacanciesSection.searchRezTitle}>
                            {dataTransl.totalTitle[locale]}{" "}
                            {filteredVacancies && filteredVacancies.length}
                        </div>
                        <div style={styles.VacanciesSection.searchRezContent}>
                            {filteredVacancies &&
                                filteredVacancies.map((vacancy, index) => (
                                    <JobCard
                                        category={vacancy.department}
                                        vacancyName={vacancy.name}
                                        description={
                                            vacancy.vacancy_contents[0].preview
                                        }
                                        slug={vacancy.slug}
                                        key={index}
                                    />
                                ))}
                            {!!filteredVacancies?.length || (
                                <span style={styles.VacanciesSection.notFound}>
                                    {dataTransl.notFound[locale]}
                                </span>
                            )}
                        </div>
                        <SendResume locale={locale} />
                    </div>
                </div>
            </div>
        </>
    )
}

function SendResume(props) {
    const { locale } = props

    const lengSendResume = {
        title: {
            en: "Didn't find a suitable vacancy?",
            ru: "Не нашли подходящую вакансию?",
            es: "¿No encontraste una vacante adecuada?",
            pt: "Não encontrou uma vaga adequada?",
        },
        content: {
            en: "Even if the vacancy you need is not on the list, send us your resume. We are always looking for talented people, and perhaps your vacancy will open soon",
            ru: "Даже если нужной вам вакансии нет в списке, пришлите нам свое резюме. Нам всегда нужны талантливые люди, и возможно, ваша вакансия откроется в ближайшее время",
            es: "Incluso si la vacante que necesitas no está en la lista, envíanos tu currículum. Siempre buscamos personas con talento, y quizás tu vacante se abra pronto.",
            pt: "Mesmo que a vaga que você precisa não esteja na lista, envie seu currículo. Estamos sempre em busca de talentos, e quem sabe sua vaga não abre em breve.",
        },
        btn: {
            en: "Send resume",
            ru: "Отправить резюме",
            es: "Enviar currículum",
            pt: "Enviar currículo",
        },
    }
    return (
        <div style={styles.SendResume.wrap}>
            <div style={styles.SendResume.leftColumn}>
                <div>
                    <h5 style={styles.SendResume.title}>
                        {lengSendResume.title[locale]}
                    </h5>
                    <div style={styles.SendResume.description}>
                        {lengSendResume.content[locale]}
                    </div>
                </div>
                <motion.button
                    whileHover={{
                        backgroundColor: "rgba(25, 17, 245, 1)",
                    }}
                    style={styles.SendResume.button}
                >
                    {lengSendResume.btn[locale]}
                </motion.button>
            </div>
            <div style={styles.SendResume.imgWrap}>
                <img
                    style={styles.SendResume.img}
                    src="https://framerusercontent.com/images/A3raWVvP4qvxqC9GEd9bGpAi2z0.png"
                    alt={lengSendResume.title[locale]}
                />
            </div>
        </div>
    )
}

function Search(props) {
    const {
        locale,
        searchQuery,
        setFunction,
        searchInitial,
        setFilteredVacancies,
    } = props
    const handleChange = (e) => {
        const value = e.target.value
        setFunction(value)
        const filtered = searchInitial.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredVacancies(filtered)
    }

    const lengSearch = {
        title: {
            en: "Open vacancies",
            ru: "Открытые вакансии",
            es: "Vacantes abiertas",
            pt: "Vagas abertas",
        },
        placeholder: {
            en: "Search open vacancies",
            ru: "Поиск по открытым ваканииям",
            es: "Buscar vacantes abiertas",
            pt: "Pesquisar vagas em aberto",
        },
    }
    return (
        <>
            <div style={styles.Search.wrap}>
                <div style={styles.Search.title}>
                    {lengSearch.title[locale]}
                </div>
                <div style={styles.Search.searchWrap}>
                    <input
                        className="search"
                        name="search"
                        type="text"
                        value={searchQuery}
                        onChange={handleChange}
                        placeholder={lengSearch.placeholder[locale]}
                    />
                    <img
                        style={{ marginLeft: 12, width: 16, height: 16 }}
                        src="https://framerusercontent.com/images/KmLtRuXJYwOQRKwLEisBmrl490.png"
                        alt="search icon"
                    />
                </div>
            </div>
            <style>
                {`
            .search{
                border: none;
                font-size: 16px;
                width : 100%;
            }
            .search::placeholder {
                font-size: 16px;
            }
              .search:focus,
                .search:hover {
                    border: none;
                    outline: none;
  }`}
            </style>
        </>
    )
}

function FilterForm(props) {
    const { locale, departments, selected, onChange } = props
    const handleInputChange = (e) => {
        onChange(e.target.value)
    }
    let totalQuantity = useMemo(() => {
        let total = 0
        if (departments) {
            for (let key of Object.keys(departments)) {
                if (departments[key]) {
                    total += departments[key] || 0
                }
            }
            return total
        }
    }, [departments])

    const lengFilterForm = {
        title: {
            en: "Filter by teams",
            ru: "Фильтровать по командам",
            es: "Filtrar por equipos",
            pt: "Filtrar por equipes",
        },
        allPointName: {
            en: "All teams",
            ru: "Все команды",
            es: "Todos los equipos",
            pt: "Todas as equipes",
        },
    }
    return (
        <div style={styles.FilterForm.wrap}>
            <div style={styles.FilterForm.title}>
                {lengFilterForm.title[locale]}
            </div>
            <form style={styles.FilterForm.form}>
                <FilterItem
                    name="allCommads"
                    title={lengFilterForm.allPointName[locale]}
                    key="1"
                    count={totalQuantity}
                    checked={selected}
                    onChange={handleInputChange}
                />

                {departments &&
                    Object.keys(departments).map((department, index) => (
                        <FilterItem
                            name={department}
                            title={department}
                            key={index}
                            count={departments[department]}
                            checked={selected}
                            onChange={handleInputChange}
                        />
                    ))}
            </form>
        </div>
    )
}

function FilterItem(props) {
    const { name, title, count, checked, onChange } = props
    return (
        <>
            <label style={styles.FilterItem.label}>
                <input
                    style={styles.FilterItem.input}
                    type="radio"
                    value={name}
                    checked={checked === name}
                    onChange={onChange}
                />
                <span style={styles.FilterItem.span}>
                    {checked === name ? (
                        <div style={styles.FilterItem.checkSpan}></div>
                    ) : (
                        ""
                    )}
                </span>
                {title} · {count}
            </label>
        </>
    )
}

type TProps = {
    category: string
    vacancyName: string
    description: string
    slug: string
}
function JobCard(props: TProps): React.JSX.Element {
    const { category, vacancyName, description, slug } = props
    return (
        <li style={styles.JobCard.wrap}>
            <a href={`/vacancy/${slug}`} style={styles.JobCard.link}>
                <div style={styles.JobCard.categoty}>{category}</div>
                <div style={styles.JobCard.title}>{vacancyName}</div>
                <div style={styles.JobCard.description}>{description}</div>
            </a>
        </li>
    )
}
