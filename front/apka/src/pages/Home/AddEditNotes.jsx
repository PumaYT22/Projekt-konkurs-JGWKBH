import React, { useState } from 'react';
import { MdClose, MdOutlineAutoAwesome } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const AddEditNotes = ({ getAllNotes, noteData, type, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || "");
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fixed AI content generation function
  const generateContentByAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Wpisz prompt, aby wygenerować treść");
      return;
    }
    
    setIsGenerating(true);
    try {
      // Fixed API call with proper error handling
      const response = await fetch("http://172.16.4.182:3000/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ message: aiPrompt }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.response) {
        setContent(data.response);
        toast.success("Treść wygenerowana przez AI!");
      } else {
        toast.error("Nie otrzymano odpowiedzi od AI.");
      }
    } catch (err) {
      console.error("Błąd generowania treści przez AI:", err);
      toast.error(`Wystąpił błąd podczas generowania treści przez AI: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", { title, content, tags });
      if (response.data && response.data.note) {
        toast.success("Dodano notatkę!");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Wystąpił błąd podczas dodawania notatki");
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, { title, content, tags });
      if (response.data && response.data.note) {
        toast.success("Zaktualizowano notatkę!");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Wystąpił błąd podczas aktualizacji notatki");
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Podaj tytuł!");
      return;
    }
    if (!content) {
      setError("Podaj treść notatki!");
      return;
    }
    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full mx-auto">
      {/* Close button */}
      <button
        className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
        onClick={onClose}
      >
        <MdClose className="text-xl text-gray-600" />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {type === 'edit' ? 'Edytuj notatkę' : 'Dodaj nową notatkę'}
      </h2>

      {/* Title input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Tytuł notatki"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* AI Prompt section with improved styling */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <MdOutlineAutoAwesome className="text-blue-500" />
            Generowanie treści przez AI
          </span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Wpisz prompt do wygenerowania treści"
            value={aiPrompt}
            onChange={({ target }) => setAiPrompt(target.value)}
          />
          <button
            className={`px-4 py-2 rounded-md font-medium text-white ${
              isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } transition-colors flex items-center gap-2 whitespace-nowrap`}
            onClick={generateContentByAI}
            disabled={isGenerating}
          >
            {isGenerating ? "Generowanie..." : "Generuj"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Wpisz prompt, aby automatycznie wygenerować treść notatki przy pomocy AI
        </p>
      </div>

      {/* Content textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Treść notatki</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md text-gray-800 min-h-[240px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Treść notatki"
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      {/* Tags input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tagi</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Tagi (rozdzielone przecinkami)"
          value={tags}
          onChange={({ target }) => setTags(target.value)}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          className="px-5 py-3 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          Anuluj
        </button>
        <button
          className="px-5 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 active:bg-green-800 transition-colors flex items-center gap-2"
          onClick={handleAddNote}
        >
          <FaSave />
          {type === 'edit' ? 'Zaktualizuj' : 'Zapisz'}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;