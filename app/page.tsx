"use client";

import Image from 'next/image'
import Todo from './components/Todo';
import useSWR from 'swr';
import { useRef } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoType } from './types';
import { API_URL } from '@/constants/url';

export default function Home() {
  //SSRを使う場合
  // const allTodos = await fetch("API", { cache: "no-store" });

  //TodoのタイトルをuseRefで取得
  const inputRef = useRef<HTMLInputElement | null>(null);

  //カスタムフックスを呼び出し
  const { todos, isLoading, error, mutate } = useTodos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log(inputRef.current?.value);

    // fetchを使ってpostAPIを叩く
    const response = await fetch(`${API_URL}/createTodo`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputRef.current?.value,
        isCompleted: false,
      }),
    });

  // useSWRのmutateを使ってキャッシュ取得
    if(response.ok && todos) {
      const newTodo = await response.json();
      mutate([...todos, newTodo]);
      if(inputRef.current?.value){
        inputRef.current.value = "";
      };
    };
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase select-none">🚀 ToDo List 🚀</h1>
      </div>
      <form 
        className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={(e: React.FormEvent) => handleSubmit(e)}
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent
          border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight
          focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
};
