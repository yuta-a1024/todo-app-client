import useSWR from "swr";
import { TodoType } from "../types";
import { API_URL } from "@/constants/url";

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json() as Promise<TodoType[] | null>);
};

export const useTodos = () => {
  const { data, isLoading, error, mutate } = useSWR(
    `${API_URL}/allTodos`,
    fetcher
  );

  return {
    todos: data,
    isLoading,
    error,
    mutate,
  };
};