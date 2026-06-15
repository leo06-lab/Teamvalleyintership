import { useCallback, useEffect, useRef, useState } from "react";

export function useInlineMessage() {
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const timeoutRef = useRef(null);

  const showMessage = useCallback((text, type = "info") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage({
      text,
      type,
    });

    timeoutRef.current = setTimeout(() => {
      setMessage({
        text: "",
        type: "",
      });
    }, 4500);
  }, []);

  const clearMessage = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage({
      text: "",
      type: "",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    message,
    showMessage,
    clearMessage,
  };
}