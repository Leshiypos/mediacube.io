// Framer-компонент: рабочая стабильная версия без процентов и форматирования
import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 *
 * @framerIntrinsicWidth 1032
 */
const slagLocale = {
    en: "en-US",
    ru: "ru-RU",
    es: "es-ES",
    pt: "pt-PT",
}
const dataTransl = {
    titleSection: {
        en: "Advance payment calculator",
        ru: "Калькулятор аванса",
        es: "Calculadora de pagos por adelantado",
        pt: "Calculadora de pagamento antecipado",
    },
    income: {
        en: "Author's Income (DAVT)",
        ru: "Доход автора (DAVT)",
        es: "Ingresos del autor (DAVT)",
        pt: "Rendimento do Autor (DAVT)",
    },
    sum: {
        en: "Advance payment amount (ZAVT)",
        ru: "Сумма аванса (ZAVT)",
        es: "Importe del pago anticipado (ZAVT)",
        pt: "Valor do pagamento antecipado (ZAVT)",
    },
    retentialRate: {
        en: "Retention Rate (DUD %)",
        ru: "Доля удержания (DUD %)",
        es: "Tasa de retención (DUD %)",
        pt: "Taxa de retenção (DUD%)",
    },
    butTitleRequest: {
        en: "Request an advance payment",
        ru: "Запросить аванс",
        es: "Solicitar un pago por adelantado",
        pt: "Solicitar um pagamento antecipado",
    },
    butTitleContactUs: {
        en: "Contact us",
        ru: "Связаться с нами",
        es: "Contáctanos",
        pt: "Contate-nos",
    },
    sumPriceDescription: {
        en: "Advance payment amount",
        ru: "Сумма аванса",
        es: "Importe del pago anticipado",
        pt: "Valor do pagamento adiantado",
    },
    sumPriceWithComDescription: {
        en: "Advance amount with commission",
        ru: "Сумма аванса с комиссией",
        es: "Importe del anticipo con comisión",
        pt: "Valor do adiantamento com comissão",
    },
    commission: {
        en: "Commission",
        ru: "Комиссия",
        es: "Comisión",
        pt: "Comissão",
    },
    periodTitle: {
        en: "Payment period",
        ru: "Период оплаты",
        es: "Periodo de pago",
        pt: "Período de pagamento",
    },
    monthsTitle: {
        en: "months",
        ru: "месяцев",
        es: "meses",
        pt: "meses",
    },
}

export default function AdvanceCalculator() {
    const [input, setInput] = useState({ ZAVT: 1000, DAVT: 3000, DUD: 0.8 })
    const [result, setResult] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [locale, setLocale] = useState("ru")

    useEffect(() => {
        const update = () => {
            setIsTablet(window.innerWidth >= 480 && window.innerWidth < 768)
            setIsMobile(window.innerWidth < 480)
        }
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])
    useEffect(() => {
        const currentUrl = window.location.href
        const loc = getLocaleFromUrl(currentUrl)
        if (loc && checkLocale(loc)) setLocale(loc)
    }, [])

    const commissionByMonths = {
        1: 0.099,
        2: 0.099,
        3: 0.125,
        4: 0.15,
        5: 0.175,
        6: 0.2,
        7: 0.225,
        8: 0.25,
        9: 0.275,
        10: 0.3,
        11: 0.325,
        12: 0.35,
    }

    const getCommission = (months) =>
        commissionByMonths[Math.min(months, 12)] || 0.35

    const calculateAdvance = ({ ZAVT, DAVT, DUD }) => {
        if (!ZAVT || !DAVT || DAVT === 0 || !DUD) return null
        let MES = Math.ceil(ZAVT / (DAVT * DUD))
        if (MES > 12) return null

        let loopCount = 0,
            currentMES = MES,
            prevMES = -1
        let commission = 0,
            finalSum = 0

        while (currentMES !== prevMES && loopCount < 10) {
            prevMES = currentMES
            commission = getCommission(currentMES)
            finalSum = ZAVT + ZAVT * commission
            currentMES = Math.ceil(finalSum / (DAVT * DUD))
            loopCount++
        }

        if (currentMES > 12) return null

        return {
            months: currentMES,
            commissionPercent: (commission * 100).toFixed(2),
            totalWithCommission: finalSum.toFixed(2),
            payout: ZAVT.toFixed(2),
            deductionPerMonth: (DAVT * DUD).toFixed(2),
        }
    }

    const adjustDUDToFitZAVT = (ZAVT, DAVT) => {
        const commission = getCommission(12)
        return Math.min(
            Math.max((ZAVT + ZAVT * commission) / (DAVT * 12), 0.5),
            1.0
        )
    }

    const adjustZAVTToFitDUD = (DUD, DAVT) => {
        const commission = getCommission(12)
        return Math.floor((DAVT * DUD * 12) / (1 + commission))
    }

    const getMinZAVT = (DAVT) => Math.floor(DAVT)
    const getMaxZAVT = (DAVT) => {
        const commission = getCommission(12)
        return Math.floor((DAVT * 1.0 * 12) / (1 + commission))
    }

    const logToLinear = (logValue) => Math.round(Math.pow(10, logValue))
    const linearToLog = (linearValue) => Math.log10(Math.max(linearValue, 1))

    const handleInputChange = (key, value) => {
        let val = parseFloat(value) || 0
        let updated = { ...input, [key]: val }

        if (key === "DAVT") {
            const maxZ = adjustZAVTToFitDUD(updated.DUD, val)
            updated.ZAVT = Math.min(updated.ZAVT, maxZ)
            const test = calculateAdvance(updated)
            if (!test) {
                updated.DUD = adjustDUDToFitZAVT(updated.ZAVT, val)
                updated.ZAVT = adjustZAVTToFitDUD(updated.DUD, val)
            }
        }

        if (key === "ZAVT") {
            const test = calculateAdvance(updated)
            if (!test) updated.DUD = adjustDUDToFitZAVT(val, input.DAVT)
        }

        if (key === "DUD") {
            const maxZAVTForDUD = adjustZAVTToFitDUD(val, input.DAVT)
            if (input.ZAVT > maxZAVTForDUD) updated.ZAVT = maxZAVTForDUD
        }

        const validated = calculateAdvance(updated)
        if (!validated) {
            updated.DUD = adjustDUDToFitZAVT(updated.ZAVT, updated.DAVT)
            updated.ZAVT = adjustZAVTToFitDUD(updated.DUD, updated.DAVT)
        }

        setInput(updated)
        setResult(calculateAdvance(updated))
    }

    useEffect(() => {
        setResult(calculateAdvance(input))
    }, [])

    const minZAVT = getMinZAVT(input.DAVT)
    const maxZAVT = getMaxZAVT(input.DAVT)
    const percent = ((input.ZAVT - minZAVT) / (maxZAVT - minZAVT)) * 100

    const styles = {
        wrapSection: {
            fontFamily: "Arial, sans-serif",
            backgroundColor: "rgba(255, 255, 255, 1)",
            padding: "10px",
            fontSize: 16,
            color: "rgba(99, 104, 132, 1)",
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
            maxWidth: 1032,
        },
        wrapCalc: {
            display: "flex",
            gap: isMobile ? 16 : 48,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 15,
            flexDirection: isMobile ? "column" : "row",
        },
        wrapColumn: {
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 8 : 16,
            flex: "1",
            width: "100%",
        },
        inputBlock: {
            display: "flex",
            flexDirection: "column",
            gap: 8,
        },
        label: {
            fontSize: isMobile ? 14 : 16,
        },
        minMaxInput: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "rgba(99, 104, 132, 1)",
            marginTop: isMobile ? -2 : -7,
            width: "94%",
            marginLeft: "auto",
            marginRight: "auto",
        },
        advanceAmounBlock: {
            fontSize: isTablet ? 40 : isMobile ? 26 : 52,
            color: "rgba(64, 57, 255, 1)",
        },
        advanceAmountResult: { textAlign: "center" },
        advanceWrapAmountResult: {
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
        },

        advanceAmountTitle: {
            fontSize: 14,
            color: "rgba(99, 104, 132, 1)",
            textAlign: "center",
        },
        advanceComissionBlock: {
            fontSize: 32,
            color: "rgba(99, 104, 132, 1)",
        },
        advanceComissionResult: {
            textAlign: "center",
            fontSize: isTablet ? 28 : 32,
        },
        advanceComissionTitle: {
            fontSize: 14,
            color: "rgba(99, 104, 132, 1)",
            textAlign: "center",
        },
        wrapDescriptionBlock: {
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
        },
        wrapDescriptionColumn: {
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            textAlign: "center",
            fontSize: isTablet ? 18 : isMobile ? 16 : 20,
            flex: 1,
        },
        descriptionTitle: {
            fontSize: 14,
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
            marginRight: "auto",
        },
        wrapButtons: {
            display: "flex",
            justifyContent: "flex-start",
            gap: 8,
        },
        button: {
            backgroundColor: "rgba(64, 57, 255, 1)",
            padding: "14px 24px",
            border: "none",
            borderRadius: 8,
            color: "rgba(255, 255, 255, 1)",
            cursor: "pointer",
            display: "block",
            textDecoration: "none",
            width: "fit-content",
            textAlign: "center",
            fontSize: 16,
        },
    }
    return (
        <>
            <style>
                {`@import url('https://fonts.cdnfonts.com/css/helvetica-neue-55');
                    p{
                        margin: 0;
                        padding: 0;
                    }
                    strong{
                        margin: 0;
                        padding: 0;
                    }
                    input[type="range"] {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 2px;
                    border-radius: 5px;
                    background: linear-gradient(to right, #4039ff 50%, #e4e7ec 50%);
                    outline: none;
                    }

                    input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: ${isMobile ? 15 : 10}px;
                    height: ${isMobile ? 15 : 10}px;
                    border-radius: 3px;
                    background: #4039ff;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    margin-top: 0;
                    }

                    input[type="range"]::-moz-range-thumb {
                    width: ${isMobile ? 15 : 10}px;
                    height: ${isMobile ? 15 : 10}px;
                    border-radius: 3px;
                    background: #4039ff;
                    cursor: pointer;
                    }
                `}
            </style>
            <div
                className="max-w-xl mx-auto mt-8 p-4 border rounded-xl shadow space-y-6"
                style={{ ...styles.wrapSection }}
            >
                <h2 className="text-2xl font-bold">
                    {dataTransl.titleSection[locale]}
                </h2>
                <div style={{ ...styles.wrapCalc }}>
                    <div
                        style={{
                            ...styles.wrapColumn,
                        }}
                    >
                        <div
                            className="space-y-2"
                            style={{ ...styles.inputBlock }}
                        >
                            <label
                                className="block font-medium"
                                style={styles.label}
                            >
                                {dataTransl.income[locale]}
                            </label>

                            <InputNumber
                                min={10}
                                max={1000000}
                                step={100}
                                value={input.DAVT}
                                onChange={(e) =>
                                    handleInputChange("DAVT", e.target.value)
                                }
                            />

                            <InputRange
                                min={1}
                                max={6}
                                step={0.01}
                                value={linearToLog(input.DAVT)}
                                onChange={(e) =>
                                    handleInputChange(
                                        "DAVT",
                                        logToLinear(parseFloat(e.target.value))
                                    )
                                }
                            />
                            <div style={styles.minMaxInput}>
                                <div>10</div>
                                <div>1000000</div>
                            </div>
                        </div>

                        <div
                            className="space-y-2"
                            style={{ ...styles.inputBlock }}
                        >
                            <label
                                className="block font-medium"
                                style={styles.label}
                            >
                                {dataTransl.sum[locale]}
                            </label>

                            <InputNumber
                                value={input.ZAVT}
                                min={minZAVT}
                                max={maxZAVT}
                                onChange={(e) =>
                                    handleInputChange("ZAVT", e.target.value)
                                }
                            />
                            <InputRange
                                min={minZAVT}
                                max={maxZAVT}
                                step={1}
                                value={input.ZAVT}
                                onChange={(e) =>
                                    handleInputChange(
                                        "ZAVT",
                                        parseFloat(e.target.value)
                                    )
                                }
                            />
                            <div style={styles.minMaxInput}>
                                <div>{minZAVT}</div>
                                <div>{maxZAVT}</div>
                            </div>
                        </div>

                        <div
                            className="space-y-2"
                            style={{ ...styles.inputBlock }}
                        >
                            <label
                                className="block font-medium"
                                style={styles.label}
                            >
                                {dataTransl.retentialRate[locale]}
                            </label>

                            <InputNumber
                                step="1"
                                min="50"
                                max="100"
                                value={Math.round(input.DUD * 100)}
                                onChange={(e) =>
                                    handleInputChange(
                                        "DUD",
                                        Math.min(
                                            Math.max(
                                                parseInt(e.target.value, 10),
                                                50
                                            ),
                                            100
                                        ) / 100
                                    )
                                }
                            />
                            <InputRange
                                min={0.5}
                                max={1.0}
                                step={0.01}
                                value={input.DUD}
                                onChange={(e) =>
                                    handleInputChange(
                                        "DUD",
                                        parseFloat(e.target.value)
                                    )
                                }
                            />
                            <div style={styles.minMaxInput}>
                                <div>50</div>
                                <div>100</div>
                            </div>
                        </div>
                        {!isMobile && (
                            <div
                                style={{
                                    ...styles.wrapButtons,
                                    flexDirection: isMobile ? "column" : "row",
                                }}
                            >
                                <ButtonBack
                                    title={dataTransl.butTitleRequest[locale]}
                                    href={`#`}
                                    withArrow={false}
                                    isDark={true}
                                />
                                <ButtonBack
                                    title={dataTransl.butTitleContactUs[locale]}
                                    href={`#`}
                                    isArrowRight={true}
                                    withArrow={true}
                                    isDark={false}
                                />
                            </div>
                        )}
                    </div>
                    {result && (
                        <div
                            className="space-y-2 text-sm"
                            style={{
                                ...styles.wrapColumn,
                                justifyContent: "flex-start",
                                height: "100%",
                                alignItems: "center",
                            }}
                        >
                            <div style={styles.advanceWrapAmountResult}>
                                <img
                                    src="https://framerusercontent.com/images/F6sCYpsbsmBGX6Xflr1PJy3Qvo.png"
                                    alt="money_wings"
                                    width={isTablet ? 59 : isMobile ? 40 : 75}
                                    height={isTablet ? 59 : isMobile ? 40 : 75}
                                />
                                <div style={styles.advanceAmounBlock}>
                                    <p style={styles.advanceAmountResult}>
                                        <strong>{result.payout}$</strong>
                                    </p>
                                    <p style={styles.advanceAmountTitle}>
                                        {dataTransl.sumPriceDescription[locale]}
                                    </p>
                                </div>
                            </div>
                            {!isMobile && (
                                <div style={styles.advanceComissionBlock}>
                                    <p style={styles.advanceComissionResult}>
                                        <strong>
                                            {result.totalWithCommission}$
                                        </strong>
                                    </p>
                                    <p style={styles.advanceComissionTitle}>
                                        {
                                            dataTransl
                                                .sumPriceWithComDescription[
                                                locale
                                            ]
                                        }
                                    </p>
                                </div>
                            )}

                            <div style={styles.wrapDescriptionBlock}>
                                {isMobile && (
                                    <div
                                        style={{
                                            ...styles.wrapDescriptionColumn,
                                        }}
                                    >
                                        <div style={{ color: "black" }}>
                                            <strong>
                                                {result.totalWithCommission}$
                                            </strong>
                                        </div>
                                        <div
                                            style={{
                                                ...styles.descriptionTitle,
                                                fontSize: 11,
                                            }}
                                        >
                                            {
                                                dataTransl
                                                    .sumPriceWithComDescription[
                                                    locale
                                                ]
                                            }
                                        </div>
                                    </div>
                                )}
                                <div
                                    style={{
                                        ...styles.wrapDescriptionColumn,
                                    }}
                                >
                                    <div style={{ color: "black" }}>
                                        <strong>
                                            {result.commissionPercent}%
                                        </strong>
                                    </div>
                                    <div
                                        style={{
                                            ...styles.descriptionTitle,
                                            fontSize: 11,
                                            flexDirection: "column",
                                        }}
                                    >
                                        {dataTransl.commission[locale]}
                                        <img
                                            src="https://framerusercontent.com/images/9ixlnLmV3rQH6XKDig5iBnFWLQ.png"
                                            alt="info button"
                                            width="16px"
                                            height="16px"
                                            title="info"
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        ...styles.wrapDescriptionColumn,
                                    }}
                                >
                                    <div style={{ color: "black" }}>
                                        <strong>
                                            {result.months}{" "}
                                            {dataTransl.monthsTitle[locale]}
                                        </strong>
                                    </div>
                                    <div
                                        style={{
                                            ...styles.descriptionTitle,
                                            fontSize: 11,
                                            flexDirection: "column",
                                        }}
                                    >
                                        {dataTransl.periodTitle[locale]}
                                        <img
                                            src="https://framerusercontent.com/images/9ixlnLmV3rQH6XKDig5iBnFWLQ.png"
                                            title="info"
                                            alt="info button"
                                            width="16px"
                                            height="16px"
                                        />
                                    </div>
                                </div>
                            </div>
                            {isMobile && (
                                <div
                                    style={{
                                        ...styles.wrapButtons,
                                        flexDirection: isMobile
                                            ? "column"
                                            : "row",
                                        width: "100%",
                                    }}
                                >
                                    <ButtonBack
                                        title={
                                            dataTransl.butTitleRequest[locale]
                                        }
                                        href={`#`}
                                        withArrow={false}
                                        isDark={true}
                                    />
                                    <ButtonBack
                                        title={
                                            dataTransl.butTitleContactUs[locale]
                                        }
                                        href={`#`}
                                        isArrowRight={true}
                                        withArrow={true}
                                        isDark={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

function InputRange(props) {
    const { min, max, step, value, onChange } = props
    const percent = ((value - min) / (max - min)) * 100

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full input-range"
            style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "94%",
                borderRadius: 4,
                marginTop: -8,
                background: `linear-gradient(to right, #4039ff ${percent}%, #e4e7ec ${percent}%)`,
            }}
        />
    )
}

function InputNumber(props) {
    const { value, onChange, min, max, step } = props

    return (
        <input
            step={step}
            min={min}
            max={max}
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={value}
            onChange={onChange}
            style={{
                fontSize: 16,
                color: "black",
                padding: 12,
                border: "none",
                backgroundColor: "rgba(245, 246, 250, 1)",
                borderRadius: 8,
            }}
        />
    )
}

type TProps = {
    title?: string
    href?: string
    isDark?: boolean
    withArrow?: boolean
    isArrowRight?: boolean
}
function ButtonBack(props) {
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const update = () => {
            setIsTablet(window.innerWidth >= 361 && window.innerWidth < 768)
            setIsMobile(window.innerWidth < 361)
        }
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])
    const { title, href, isDark, withArrow, isArrowRight } = props
    const styles = {
        button: {
            backgroundColor: "rgba(64, 57, 255, 1)",
            padding: "14px 24px",
            border: "none",
            borderRadius: 8,
            color: "rgba(255, 255, 255, 1)",
            cursor: "pointer",
            display: "block",
            textDecoration: "none",
            width: "fit-content",
            textAlign: "center",
            fontSize: 16,
        },
    }
    return (
        <motion.a
            href={href}
            whileHover={{
                backgroundColor: isDark ? hover : white,
                color: isDark ? white : "rgba(25, 28, 31, 1)",
            }}
            style={{
                ...styles.button,
                backgroundColor: isDark ? dark : white,
                color: isDark ? white : textGray,
                fontWeight: isDark ? 400 : 600,
                fontSize: isTablet || isMobile ? 14 : 16,
                width: isMobile ? "100%" : null,
            }}
        >
            {withArrow && !isArrowRight && (
                <span style={{ marginRight: 14 }}>{"<"}</span>
            )}
            {title}
            {withArrow && isArrowRight && (
                <span style={{ marginLeft: 14 }}>{">"}</span>
            )}
        </motion.a>
    )
}

const dark = "rgba(64, 57, 255, 1)"
const gray = "rgba(64, 57, 255, 0)"
const white = "rgba(255, 255, 255, 1)"
const hover = "rgba(47, 40, 219, 1)"
const textGray = "rgba(99, 104, 132, 1)"

ButtonBack.defaultProps = {
    title: "Кнопка со стрелкой",
    href: "#",
    isDark: false,
    withArrow: false,
    isArrowRight: false,
}

export function getLocaleFromUrl(url) {
    const regex = /https?:\/\/[^\/]+\/([a-z]{2})-[A-Z]{2}/
    const match = url.match(regex)
    return match ? match[1] : null
}

export function checkLocale(leng) {
    const languagesPos = ["ru", "pt", "es", "en"]
    return languagesPos.includes(leng)
}
