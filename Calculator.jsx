// Framer-компонент: рабочая стабильная версия без процентов и форматирования
import * as React from "react";
import { useState, useEffect } from "react";
import ButtonBack from "https://framer.com/m/ButtonBack-gKLV.js";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 *
 * @framerIntrinsicWidth 1032
 */

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
    gap: 48,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  wrapColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: "1 1 300px",
  },
  inputBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  minMaxInput: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "rgba(99, 104, 132, 1)",
    marginTop: -7,
    width: "94%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  advanceAmounBlock: {
    fontSize: 52,
    color: "rgba(64, 57, 255, 1)",
  },
  advanceAmountResult: { textAlign: "center" },
  advanceAmountTitle: {
    fontSize: 14,
    color: "rgba(99, 104, 132, 1)",
    textAlign: "center",
  },
  advanceComissionBlock: {
    fontSize: 32,
    color: "rgba(99, 104, 132, 1)",
  },
  advanceComissionResult: { textAlign: "center" },
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
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
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
    justifyContent: "space-between",
  },
};

export default function AdvanceCalculator() {
  const [input, setInput] = useState({ ZAVT: 1000, DAVT: 3000, DUD: 0.8 });
  const [result, setResult] = useState(null);

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
  };

  const getCommission = (months) =>
    commissionByMonths[Math.min(months, 12)] || 0.35;

  const calculateAdvance = ({ ZAVT, DAVT, DUD }) => {
    if (!ZAVT || !DAVT || DAVT === 0 || !DUD) return null;
    let MES = Math.ceil(ZAVT / (DAVT * DUD));
    if (MES > 12) return null;

    let loopCount = 0,
      currentMES = MES,
      prevMES = -1;
    let commission = 0,
      finalSum = 0;

    while (currentMES !== prevMES && loopCount < 10) {
      prevMES = currentMES;
      commission = getCommission(currentMES);
      finalSum = ZAVT + ZAVT * commission;
      currentMES = Math.ceil(finalSum / (DAVT * DUD));
      loopCount++;
    }

    if (currentMES > 12) return null;

    return {
      months: currentMES,
      commissionPercent: (commission * 100).toFixed(2),
      totalWithCommission: finalSum.toFixed(2),
      payout: ZAVT.toFixed(2),
      deductionPerMonth: (DAVT * DUD).toFixed(2),
    };
  };

  const adjustDUDToFitZAVT = (ZAVT, DAVT) => {
    const commission = getCommission(12);
    return Math.min(
      Math.max((ZAVT + ZAVT * commission) / (DAVT * 12), 0.5),
      1.0
    );
  };

  const adjustZAVTToFitDUD = (DUD, DAVT) => {
    const commission = getCommission(12);
    return Math.floor((DAVT * DUD * 12) / (1 + commission));
  };

  const getMinZAVT = (DAVT) => Math.floor(DAVT);
  const getMaxZAVT = (DAVT) => {
    const commission = getCommission(12);
    return Math.floor((DAVT * 1.0 * 12) / (1 + commission));
  };

  const logToLinear = (logValue) => Math.round(Math.pow(10, logValue));
  const linearToLog = (linearValue) => Math.log10(Math.max(linearValue, 1));

  const handleInputChange = (key, value) => {
    let val = parseFloat(value) || 0;
    let updated = { ...input, [key]: val };

    if (key === "DAVT") {
      const maxZ = adjustZAVTToFitDUD(updated.DUD, val);
      updated.ZAVT = Math.min(updated.ZAVT, maxZ);
      const test = calculateAdvance(updated);
      if (!test) {
        updated.DUD = adjustDUDToFitZAVT(updated.ZAVT, val);
        updated.ZAVT = adjustZAVTToFitDUD(updated.DUD, val);
      }
    }

    if (key === "ZAVT") {
      const test = calculateAdvance(updated);
      if (!test) updated.DUD = adjustDUDToFitZAVT(val, input.DAVT);
    }

    if (key === "DUD") {
      const maxZAVTForDUD = adjustZAVTToFitDUD(val, input.DAVT);
      if (input.ZAVT > maxZAVTForDUD) updated.ZAVT = maxZAVTForDUD;
    }

    const validated = calculateAdvance(updated);
    if (!validated) {
      updated.DUD = adjustDUDToFitZAVT(updated.ZAVT, updated.DAVT);
      updated.ZAVT = adjustZAVTToFitDUD(updated.DUD, updated.DAVT);
    }

    setInput(updated);
    setResult(calculateAdvance(updated));
  };

  useEffect(() => {
    setResult(calculateAdvance(input));
  }, []);

  const minZAVT = getMinZAVT(input.DAVT);
  const maxZAVT = getMaxZAVT(input.DAVT);
  const percent = ((input.ZAVT - minZAVT) / (maxZAVT - minZAVT)) * 100;
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
                    width: 10px;
                    height: 10px;
                    border-radius: 3px;
                    background: #4039ff;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    margin-top: 0;
                    }

                    input[type="range"]::-moz-range-thumb {
                    width: 10px;
                    height: 10px;
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
        <h2 className="text-2xl font-bold">Калькулятор аванса</h2>
        <div style={{ ...styles.wrapCalc }}>
          <div
            style={{
              ...styles.wrapColumn,
            }}
          >
            <div className="space-y-2" style={{ ...styles.inputBlock }}>
              <label className="block font-medium">Доход автора (DAVT)</label>

              <InputNumber
                min={10}
                max={1000000}
                step={100}
                value={input.DAVT}
                onChange={(e) => handleInputChange("DAVT", e.target.value)}
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

            <div className="space-y-2" style={{ ...styles.inputBlock }}>
              <label className="block font-medium">Сумма аванса (ZAVT)</label>

              <InputNumber
                value={input.ZAVT}
                min={minZAVT}
                max={maxZAVT}
                onChange={(e) => handleInputChange("ZAVT", e.target.value)}
              />
              <InputRange
                min={minZAVT}
                max={maxZAVT}
                step={1}
                value={input.ZAVT}
                onChange={(e) =>
                  handleInputChange("ZAVT", parseFloat(e.target.value))
                }
              />
              <div style={styles.minMaxInput}>
                <div>{minZAVT}</div>
                <div>{maxZAVT}</div>
              </div>
            </div>

            <div className="space-y-2" style={{ ...styles.inputBlock }}>
              <label className="block font-medium">
                Доля удержания (DUD %)
              </label>

              <InputNumber
                step="1"
                min="50"
                max="100"
                value={Math.round(input.DUD * 100)}
                onChange={(e) =>
                  handleInputChange(
                    "DUD",
                    Math.min(Math.max(parseInt(e.target.value, 10), 50), 100) /
                      100
                  )
                }
              />
              <InputRange
                min={0.5}
                max={1.0}
                step={0.01}
                value={input.DUD}
                onChange={(e) =>
                  handleInputChange("DUD", parseFloat(e.target.value))
                }
              />
              <div style={styles.minMaxInput}>
                <div>50</div>
                <div>100</div>
              </div>
            </div>
            <div style={styles.wrapButtons}>
              <ButtonBack
                title={"Запросить аванс"}
                href={`#`}
                withArrow={false}
                isDark={true}
              />
              <ButtonBack
                title={"Связаться с нами"}
                href={`#`}
                isArrowRight={true}
                withArrow={true}
                isDark={false}
              />
            </div>
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
              <img
                src="https://framerusercontent.com/images/F6sCYpsbsmBGX6Xflr1PJy3Qvo.png"
                alt="money_wings"
                width="75px"
                height="75px"
              />
              <div style={styles.advanceAmounBlock}>
                <p style={styles.advanceAmountResult}>
                  <strong>{result.payout}$</strong>
                </p>
                <p style={styles.advanceAmountTitle}>Advance amount</p>
              </div>
              <div style={styles.advanceComissionBlock}>
                <p style={styles.advanceComissionResult}>
                  <strong>{result.totalWithCommission}$</strong>
                </p>
                <p style={styles.advanceComissionTitle}>
                  Advance amount with commission
                </p>
              </div>
              <div style={styles.wrapDescriptionBlock}>
                <div style={styles.wrapDescriptionColumn}>
                  <div>
                    <strong>{result.commissionPercent}%</strong>
                  </div>
                  <div style={styles.descriptionTitle}>
                    Commission{" "}
                    <img
                      src="https://framerusercontent.com/images/9ixlnLmV3rQH6XKDig5iBnFWLQ.png"
                      alt="info button"
                      width="16px"
                      height="16px"
                      title="info"
                    />
                  </div>
                </div>
                <div style={styles.wrapDescriptionColumn}>
                  <div>
                    <strong>{result.months} months</strong>
                  </div>
                  <div style={styles.descriptionTitle}>
                    Payment period
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InputRange(props) {
  const { min, max, step, value, onChange } = props;
  const percent = ((value - min) / (max - min)) * 100;

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
  );
}

function InputNumber(props) {
  const { value, onChange, min, max, step } = props;

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
  );
}
