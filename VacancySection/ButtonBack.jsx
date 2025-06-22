// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
type TProps = {
    title?: string
    href?: string
    isDark?: boolean
    withArrow?: boolean
    isArrowRight?: boolean
}
export default function ButtonBack(props) {
    const { title, href, isDark, withArrow, isArrowRight } = props

    return (
        <motion.a
            href={href}
            whileHover={{
                backgroundColor: hover,
                color: "rgba(255, 255, 255, 1)",
            }}
            style={{
                ...styles.button,
                backgroundColor: isDark ? dark : gray,
                color: isDark ? white : dark,
                fontWeight: isDark ? 400 : 600,
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

const styles = {
    button: {
        backgroundColor: "rgba(64, 57, 255, 1)",
        padding: "10px 16px",
        border: "none",
        borderRadius: 8,
        color: "rgba(255, 255, 255, 1)",
        width: "fit-content",
        cursor: "pointer",
        display: "block",
        textDecoration: "none",
    },
}
const dark = "rgba(64, 57, 255, 1)"
const gray = "rgba(64, 57, 255, 0.08)"
const white = "rgba(255, 255, 255, 1)"
const hover = "rgba(25, 17, 245, 1)"

ButtonBack.defaultProps = {
    title: "Кнопка со стрелкой",
    href: "#",
    isDark: false,
    withArrow: false,
    isArrowRight: false,
}

addPropertyControls(ButtonBack, {
    title: { type: ControlType.String, title: "Button text title" },
})
