import React, { useState } from "react";
// import { TodoType } from "../types";
import useSWR from "swr";
import { mutate } from "swr";
import { useTodos } from "../hooks/useTodos";
import { TodoType } from "../types";
import { API_URL } from "@/constants/url";
import Modal from "./Modal";

type TodoProps = {
  todo: TodoType;
};

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);
  const { todos, isLoading, error, mutate } = useTodos();
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if(isEditing) {
      // 編集用APIを叩いてTodoのタイトルを編集
      const response = await fetch(
        `${API_URL}/editTodo/${todo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({title: editedTitle}),
        }
      );
      // useSWRのmutateを使ってキャッシュ取得
      if (response.ok && todos) {
        const editedTodo = await response.json();
        const updatedTodos = todos.map((todo: TodoType) => todo.id === editedTodo.id ? editedTodo : todo);
        mutate(updatedTodos);
      };
    };
  };

  const handleDelete = async (id: number) => {
    setIsOpen(true);
  };

  // Todo削除用のAPIを叩いてTodoを削除
  const confirmedDelete = async (id: number) => {
    setIsOpen(false);
    const response = await fetch(
      `${API_URL}/deleteTodo/${todo.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok && todos) {
      const deletedTodo = await response.json();
      //削除したtodo以外を取り出す
      const updatedTodos = todos.filter((todo: TodoType) => todo.id !== deletedTodo.id);
      mutate(updatedTodos);
    };
  };

  const canceledDelete = () => {
    setIsOpen(false);
    return;
  };

  //チェックボックスを押すことで完了・未完了状態を実装
  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !isCompleted }),//反転
    });
    // todosが存在することを確認
    if (response.ok && todos) {
      const updatedTodos = todos.map((todo: TodoType) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      // 更新されたtodosをキャッシュにセット
      mutate(updatedTodos);
    };
  };

  return (
    <div>
      <li className="py-4 flex-col select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label className="ml-2 block text-gray-900">
            <input
              id="todo1"
              name="todo1"
              type="checkbox"
              checked={todo.isCompleted}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500
                    border-gray-300 rounded"
              onChange={() => toggleTodoCompletion(todo.id, todo.isCompleted)}
            />
              {isEditing ? (
                <input 
                  type="text" 
                  className="border rounded py-1 px-2 border-none outline-none outline-transparent" 
                  value={editedTitle} 
                  onChange={(e) =>  setEditedTitle(e.target.value)}
                />
                ) : (
                <span 
                  className={`text-2xl font-medium mx-3 ${todo.isCompleted ? "line-through" : "" }`}
                >
                {todo.title}
                </span>
              )}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            <button
            onClick={() => handleDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            >
              ✖
            </button>
            <Modal 
              isOpen={isOpen}
              confirmedDelete={confirmedDelete}
              canceledDelete={canceledDelete} />
          </div>
        </div>
        <div className="mt-4 mb-1 ml-2 space-y-2">
          <div>作成日時：{new Date(todo.createdAt).toLocaleString()}</div>
          <div>更新日時：{new Date(todo.updatedAt).toLocaleString()}</div>
        </div>
      </li>
    </div>
  );
};

export default Todo;