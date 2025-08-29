import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEntry } from "@/hooks/api"
import { PasswordInput } from "./ui/password-input"
import { LogoBIM, LogoDEE } from "./SVG"
import styles from "./ui/Login.module.css"

export const Login = () => {
    const { Entry } = useEntry()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [group, setGroup] = useState<string>("") // Добавлено состояние для группы
    const [cookieSession] = useState(document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1].toLowerCase())
    const [cookieStatus] = useState(document.cookie.split('; ').find(row => row.startsWith('status='))?.split('=')[1].toLowerCase())
    const navigate = useNavigate()

    useEffect(() => {
        if (cookieStatus || cookieSession) {
            navigate("/lesson")
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <LogoBIM width={"70px"} height={"auto"} />
            </div>
            <div className={styles.center}>
                <div className={styles.loginBox}>
                    <div>
                        <div className={styles.loginLabel}>
                            Авторизация
                        </div>
                        <div className={styles.formContainer}>
                            <div>
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Логин*<span className={styles.requiredIndicator}></span>
                                    </label>
                                    <input
                                        className={styles.input}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Имя фамилия"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Пароль*<span className={styles.requiredIndicator}></span>
                                    </label>
                                    <PasswordInput
                                        className={styles.input}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Пароль"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Группа*<span className={styles.requiredIndicator}></span>
                                    </label>
                                    <input
                                        className={styles.input}
                                        onChange={(e) => setGroup(e.target.value)}
                                        placeholder="Ваша группа"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button
                                    className={styles.button}
                                    onClick={() => Entry(username, password, group)}
                                >
                                    Войти
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.bigLogo}>
                        <LogoDEE />
                    </div>
                </div>
            </div>
        </div>
    )
}