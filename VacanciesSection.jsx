// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"

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

export default function VacanciesSection(props) {
    const [vacancies, setVacancies] = useState(null)
    const [selectedDepartment, setSelectedDepartment] = useState("allCommads")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchInitial, setSearchInitial] = useState(null)
    const [filteredVacancies, setFilteredVacancies] = useState(null)

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

    return (
        <>
            <style>{`
            @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
            `}</style>
            <div style={styles.VacanciesSection.wrap}>
                <h2 style={styles.VacanciesSection.title}>
                    {filteredVacancies?.length || ""} открытых позиций
                </h2>
                <div style={styles.VacanciesSection.description}>
                    За год мы вырастаем на 30%, поэтому у нас всегда есть
                    открытые вакансии.Ищем талантливых специалистов в разные
                    отделы: от маркетинга до IT
                </div>
                <div style={styles.VacanciesSection.wrapContent}>
                    <div>
                        <Search
                            searchQuery={searchQuery}
                            setFunction={setSearchQuery}
                            searchInitial={searchInitial}
                            setFilteredVacancies={setFilteredVacancies}
                        />
                        <FilterForm
                            departments={departments}
                            selected={selectedDepartment}
                            onChange={setSelectedDepartment}
                        />
                    </div>
                    <div>
                        <div style={styles.VacanciesSection.searchRezTitle}>
                            Результаты поиска:{" "}
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
                                    Не найдено результатов, соответствующих
                                    вашим критериям
                                </span>
                            )}
                        </div>
                        <SendResume />
                    </div>
                </div>
            </div>
        </>
    )
}

function SendResume(props) {
    return (
        <div style={styles.SendResume.wrap}>
            <div style={styles.SendResume.leftColumn}>
                <div>
                    <h5 style={styles.SendResume.title}>
                        Не нашли подходящую вакансию?
                    </h5>
                    <div style={styles.SendResume.description}>
                        Даже если нужной вам вакансии нет в списке, пришлите нам
                        свое резюме. Нам всегда нужны талантливые люди, и
                        возможно, ваша вакансия откроется в ближайшее время
                    </div>
                </div>
                <motion.button
                    whileHover={{
                        backgroundColor: "rgba(25, 17, 245, 1)",
                    }}
                    style={styles.SendResume.button}
                >
                    Отправить резюме
                </motion.button>
            </div>
            <div style={styles.SendResume.imgWrap}>
                <img
                    style={styles.SendResume.img}
                    src="https://framerusercontent.com/images/A3raWVvP4qvxqC9GEd9bGpAi2z0.png"
                    alt="Не нашли подходящую вакансию?"
                />
            </div>
        </div>
    )
}

function Search(props) {
    const { searchQuery, setFunction, searchInitial, setFilteredVacancies } =
        props
    const handleChange = (e) => {
        const value = e.target.value
        setFunction(value)
        const filtered = searchInitial.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredVacancies(filtered)
    }
    return (
        <>
            <div style={styles.Search.wrap}>
                <div style={styles.Search.title}>Открытые вакансии</div>
                <div style={styles.Search.searchWrap}>
                    <input
                        className="search"
                        name="search"
                        type="text"
                        value={searchQuery}
                        onChange={handleChange}
                        placeholder="Поиск по открытым ваканииям"
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
            }
            .search::placeholder {
                font-size: 16px;
            }`}
            </style>
        </>
    )
}

function FilterForm(props) {
    const { departments, selected, onChange } = props
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
    return (
        <div style={styles.FilterForm.wrap}>
            <div style={styles.FilterForm.title}>Фильтровать по командам</div>
            <form style={styles.FilterForm.form}>
                <FilterItem
                    name="allCommads"
                    title="Все команды"
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
            <a href={`/vacancy?slug=${slug}`} style={styles.JobCard.link}>
                <div style={styles.JobCard.categoty}>{category}</div>
                <div style={styles.JobCard.title}>{vacancyName}</div>
                <div style={styles.JobCard.description}>{description}</div>
            </a>
        </li>
    )
}
