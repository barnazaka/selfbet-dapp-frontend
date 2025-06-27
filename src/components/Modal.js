import React from 'react';

const Modal = ({ message, closeModal }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-lg">
      <p className="text-white text-lg mb-4">{message}</p>
      <button
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg"
        onClick={closeModal}
      >
        Close
      </button>
    </div>
  </div>
);

export default Modal;