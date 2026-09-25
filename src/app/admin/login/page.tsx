import { LoginForm } from "./LoginForm";
import styles from "../admin.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginWrap}>
      <LoginForm />
    </div>
  );
}
