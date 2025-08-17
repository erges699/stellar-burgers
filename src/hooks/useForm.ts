import { SetStateAction, useState } from 'react';

export function useForm<T extends Record<string, any>>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: { target: { name: string; value: any } }) => {
    const { value, name } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const setFieldValue =
    (name: keyof T) => (value: SetStateAction<T[keyof T]>) => {
      setValues((prevValues) => ({
        ...prevValues,
        [name]:
          typeof value === 'function'
            ? (value as (prev: T[keyof T]) => T[keyof T])(prevValues[name])
            : value
      }));
    };

  return { values, handleChange, setValues, setFieldValue };
}
