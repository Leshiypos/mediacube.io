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
const BASE_URL = "https://mcpay.mc-team.workers.dev/api/client/vacancies"

export default function VacanciesSection(props) {
    const [vacancies, setVacancies] = useState(null)
    const [selectedDepartment, setSelectedDepartment] = useState("allCommads")

    useEffect(() => {
        fetch(BASE_URL)
            .then((response) =>
                response.ok
                    ? response.json()
                    : Promise.reject(`Ошибка ${response.status}`)
            )
            .then((data) => {
                setVacancies(data.data)
                console.log("Вакансии", data.data)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])

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

    const filteredVacancies = useMemo(() => {
        if (selectedDepartment === "allCommads") return vacancies
        return vacancies.filter((v) => v.department === selectedDepartment)
    }, [selectedDepartment, vacancies])
    //const vacancies = store.vacancies

    return (
        <>
            <style>{`
            @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
            `}</style>
            <div
                style={{
                    ...conteinerStyle,
                    ...centredStyle,
                    fontFamily: "'SF Pro Display', sans-serif",
                }}
            >
                <h1 style={{ textAlign: "center" }}>7 открытых позиций</h1>
                <div
                    style={{
                        ...centredStyle,
                        maxWidth: 800,
                        color: "rgba(99, 104, 132, 1)",
                        fontSize: 20,
                        textAlign: "center",
                    }}
                >
                    За год мы вырастаем на 30%, поэтому у нас всегда есть
                    открытые вакансии.Ищем талантливых специалистов в разные
                    отделы: от маркетинга до IT
                </div>
                <div style={{ display: "flex", marginTop: 80, gap: 24 }}>
                    <div>
                        <Search />
                        <FilterForm
                            departments={departments}
                            selected={selectedDepartment}
                            onChange={setSelectedDepartment}
                        />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                            Результаты поиска: 5
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            {vacancies &&
                                filteredVacancies.map((vacancy, index) => (
                                    <JobCard
                                        category={vacancy.department}
                                        vacancyName={vacancy.name}
                                        description={
                                            vacancy.vacancy_contents[0].preview
                                        }
                                        key={index}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const conteinerStyle = {
    maxWidth: 1032,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexFlow: "column wrap",
}
const centredStyle = {
    marginLeft: "auto",
    marginRight: "auto",
}

function FilterForm(props) {
    const { departments, selected, onChange } = props
    const handleInputChange = (e) => {
        onChange(e.target.value)
        console.log(e.target.value)
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
        <div
            style={{
                display: "flex",
                flexFlow: "column nowrap",
                gap: 10,
            }}
        >
            <div style={{ fontSize: 16, color: "rgba(99, 104, 132, 1)" }}>
                Фильтровать по командам
            </div>
            <form
                style={{ display: "flex", flexFlow: "column nowrap", gap: 10 }}
            >
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
    console.log(checked === name)
    return (
        <>
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: 14,
                }}
            >
                <input
                    style={{ display: "none" }}
                    type="radio"
                    value={name}
                    checked={checked === name}
                    onChange={onChange}
                />
                <span
                    style={{
                        display: "block",
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        padding: 5,
                        border: "1px solid rgba(64, 57, 255, 1)",
                    }}
                >
                    {checked === name ? (
                        <div
                            style={{
                                backgroundColor: "rgba(64, 57, 255, 1)",
                                width: "100%",
                                height: "100%",
                                borderRadius: 3,
                            }}
                        ></div>
                    ) : (
                        ""
                    )}
                </span>
                {title} · {count}
            </label>
        </>
    )
}

function Search(props) {
    return (
        <>
            <div style={{ width: "100%" }}>
                <div
                    style={{
                        fontSize: 16,
                        color: "rgba(99, 104, 132, 1)",
                        paddingBottom: 8,
                    }}
                >
                    Открытые вакансии
                </div>
                <div
                    style={{
                        width: "100%",
                        padding: 12,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        borderRadius: 8,
                        display: "flex",
                    }}
                >
                    <input
                        className="search"
                        style={{}}
                        name="search"
                        type="text"
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

type TProps = {
    category: string
    vacancyName: string
    description: string
}
function JobCard(props: TProps): React.JSX.Element {
    const { category, vacancyName, description } = props
    return (
        <li style={styles.wrap}>
            <div style={styles.categoty}>{category}</div>
            <div style={styles.title}>{vacancyName}</div>
            <div style={styles.description}>{description}</div>
        </li>
    )
}

const styles = {
    wrap: {
        margin: 0,
        listStyleType: "none",
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 1)",
        padding: 24,
        width: "100%",
    },
    categoty: {
        color: "rgba(64, 57, 255, 1)",
        paddingBottom: 8,
        fontSize: 14,
    },
    title: { paddingBottom: 4, fontSize: 20, fontWeight: 600 },
    description: { fontSize: 16, color: "rgba(99, 104, 132, 1)" },
}
