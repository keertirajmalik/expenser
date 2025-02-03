import { useEffect, useState } from "react";

export function useCurrencyFormat(
  onChange: (value: string) => void,
  options: {
    locale?: string;
    currency?: string;
    debounceMs?: number;
  } = {},
) {
  const { locale = "en-IN", currency = "INR", debounceMs = 1000 } = options;
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleChange = (value: string) => {
    // Allow only one decimal point and limit to 2 decimal places
    const rawValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1")
      .replace(/(\.\d{2}).*/g, "$1");
    onChange(rawValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        if (rawValue) {
          const numericValue = parseFloat(rawValue);
          if (!Number.isNaN(numericValue)) {
            const formattedValue = currencyFormatter.format(numericValue);
            onChange(formattedValue);
          }
        }
      }, debounceMs),
    );
  };

  return handleChange;
}
