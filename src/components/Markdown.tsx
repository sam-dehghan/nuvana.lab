import ReactMarkdown from "react-markdown";
import styles from "./Markdown.module.css";

/** Raw HTML is not rendered, so article text can never inject scripts. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className={styles.prose}>
      <ReactMarkdown
        components={{
          a: ({ href, children: text }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {text}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
