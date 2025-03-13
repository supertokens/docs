import React, { useCallback, useEffect, type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/MDXComponents/Img";

import styles from "./styles.module.css";

function transformImgClassName(className?: string): string {
  return clsx(className, styles.img);
}

export default function MDXImg(props: Props): ReactNode {
  const [isMaximized, setIsMaximized] = React.useState(false);

  const onClickImageOverlay = useCallback(() => {
    setIsMaximized(false);
  }, []);

  const onClickImage = useCallback(() => {
    setIsMaximized(true);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setIsMaximized(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <>
      <img
        decoding="async"
        loading="lazy"
        {...props}
        className={transformImgClassName(props.className)}
        onClick={onClickImage}
      />
      {isMaximized ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={onClickImageOverlay}
        >
          <img
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            decoding="async"
            loading="lazy"
            {...props}
            className={transformImgClassName(props.className)}
          />
        </div>
      ) : null}
    </>
  );
}
