import { useState, useCallback } from "react";

// Reusable controlled-input logic. Keeps components thin and gives every
// field the same single-source-of-truth behavior described in the
// controlled components section of the experiment brief.
export function useForm(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const reset = useCallback((next = "") => setValue(next), []);

  return { value, handleChange, setValue, reset };
}
