"use client"

import useSWR from "swr";
import { TodoType } from "../types";
import { API_URL } from "@/constants/url";

// カスタムフックスを作ってリファクタリング

//fetcherの定義
async function fetcher(key: string) {
  return fetch(key).then((res) => res.json() as Promise<TodoType[] | null>);
};

//useSWRを使ってキャッシュ化されるデータフェッチ(適度なタイミングでrevalidate)
export const useTodos = () => {
  const { data, isLoading, error, mutate } = useSWR(
    `${API_URL}/allTodos`,
    fetcher
  );
  
  if (data !== null && data !== undefined) {
    data.sort(function(a, b) {
      return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
    });
  };
  
  // console.log(data);

  return {
    todos: data,
    isLoading,
    error,
    mutate,
  };
};