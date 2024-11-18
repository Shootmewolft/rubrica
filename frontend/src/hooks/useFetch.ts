import { useEffect, useState } from "react";

type DataType<T> = T | null;
type ErrorType = Error | null;

interface Props<T> {
  data: DataType<T>;
  error: ErrorType;
  loading: boolean;
}

export const useFetch = <T>(url: string): Props<T> => {
  const [data, setData] = useState<DataType<T>>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(url, controller);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};