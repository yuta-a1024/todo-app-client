import React from "react";

const Modal = ({ isOpen, confirmedDelete, canceledDelete }: any) => {
  const closeModal = () => {
    // モーダルを閉じる処理を実行
    canceledDelete();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? "block" : "hidden"} bg-gray-900 bg-opacity-75`}
      // モーダルの背景部分がクリックされたら closeModal 関数を実行
      onClick={closeModal}
    >
      <div className="bg-white text-2xl p-8 rounded shadow-md">
        <p>本当に削除しますか？</p>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-4 mt-4 px-4 py-4 bg-red-500 text-white rounded"
            onClick={confirmedDelete}
          >
            はい
          </button>
          <button
            className="mt-4 px-4 py-4 bg-gray-400 rounded"
            onClick={canceledDelete}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
