import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from 'moment'
import { MdOutlinePushPin, MdCreate, MdDelete, MdArrowBack, MdOutlineAutoAwesomeMotion, MdQuiz } from 'react-icons/md'
import Navbar from '../../components/Navbar/Navbar'
import { toast, ToastContainer } from 'react-toastify'
import Modal from 'react-modal'
import AddEditNotes from '../Home/AddEditNotes'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);
      
      const aiPrompt = `Skróć następującą notatkę, zachowując najważniejsze informacje:\n\n${note.content}`;
      
      const response = await fetch("http://localhost:8000/chat", {
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
        setSummary(data.response);
        toast.success("Streszczenie wygenerowane pomyślnie!");
      } else {
        toast.error("Nie otrzymano odpowiedzi od AI.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Wystąpił błąd podczas generowania streszczenia");
    } finally {
      setSummaryLoading(false);
    }
  };


  const generateQuiz = async () => {
    try {
      setQuizLoading(true);
      
      const aiPrompt = `Utwórz 3-5 pytań testowych na podstawie poniższej notatki. Dla każdego pytania podaj 3-4 odpowiedzi oraz zaznacz, która odpowiedź jest prawidłowa. Format: JSON zawierający tablicę obiektów, gdzie każdy obiekt ma pola: 'question', 'options' (tablica możliwych odpowiedzi), 'correctAnswer' (indeks poprawnej odpowiedzi). Oto notatka:\n\n${note.content}`;
      
      const response = await fetch("http://localhost:8000/chat", {
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
        try {
          // Try to extract JSON from the response
          const jsonStr = data.response.match(/```json\s*([\s\S]*?)\s*```/) || 
                          data.response.match(/\[\s*\{\s*"question"/);
          
          let parsedQuestions;
          if (jsonStr && jsonStr[1]) {
            parsedQuestions = JSON.parse(jsonStr[1]);
          } else {
            parsedQuestions = JSON.parse(data.response);
          }
          
          setQuizQuestions(parsedQuestions);
          toast.success("Test został wygenerowany!");
        } catch (parseError) {
          console.error("Error parsing quiz questions:", parseError);
          toast.error("Nie udało się przetworzyć odpowiedzi AI");
        }
      } else {
        toast.error("Nie otrzymano odpowiedzi od AI.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Wystąpił błąd podczas generowania testu");
    } finally {
      setQuizLoading(false);
    }
  };

  const fetchNoteDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/get-note/${id}`);
      if (response.data && response.data.note) {
        setNote(response.data.note);
      } else {
        toast.error("Nie można znaleźć notatki");
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      toast.error("Wystąpił błąd podczas ładowania notatki");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };


  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };


  const updateIsPinned = async () => {
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${id}`, {
        isPinned: !note.isPinned
      });

      if (response.data && response.data.note) {
        toast.success("Zaktualizowano pinezkę!");
        setNote({
          ...note,
          isPinned: !note.isPinned
        });
      }
    } catch (error) {
      console.error("Error updating pin status:", error);
      toast.error("Nie udało się zaktualizować pinezki");
    }
  };

  
  const deleteNote = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć tę notatkę?")) {
      try {
        const response = await axiosInstance.delete(`/delete-note/${id}`);
        if (response.data && !response.data.error) {
          toast.success("Notatka usunięta pomyślnie!");
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Nie udało się usunąć notatki");
      }
    }
  };


  const cleanMarkdownContent = (content) => {
    if (content && typeof content === 'string') {
    
      content = content.replace(/^```markdown\s*/gm, '');
      content = content.replace(/\s*```$/gm, '');
    
      content = content.replace(/^```\s*\w*\s*/gm, '');
      content = content.replace(/\s*```$/gm, '');
      return content;
    }
    return content || "";
  };

 
  const markdownStyles = `
    .markdown-body h1 {
      font-size: 2em;
      font-weight: 700;
      margin-top: 1em;
      margin-bottom: 0.5em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    
    .markdown-body h2 {
      font-size: 1.5em;
      font-weight: 700;
      margin-top: 1em;
      margin-bottom: 0.5em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    
    .markdown-body ul, .markdown-body ol {
      padding-left: 2em;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
    
    .markdown-body ul li {
      list-style-type: disc;
      margin-bottom: 0.25em;
    }
    
    .markdown-body ol li {
      list-style-type: decimal;
      margin-bottom: 0.25em;
    }
    
    .markdown-body strong {
      font-weight: 700;
    }
    
    .markdown-body em {
      font-style: italic;
    }
    
    .markdown-body pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
    
    .markdown-body code {
      font-family: monospace;
      background-color: rgba(27,31,35,0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
  `;

  useEffect(() => {
    fetchNoteDetails();
    getUserInfo();
  }, [id]);

  const handleSearch = (query) => {
    navigate('/', { state: { searchQuery: query } });
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={handleSearch} />
      
 
      <style>{markdownStyles}</style>
      
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : note ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with back button */}
            <div className="flex items-center gap-2 p-4 bg-gray-50 border-b">
              <button 
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MdArrowBack className="text-xl" />
              </button>
              <h1 className="text-xl font-medium">Szczegóły notatki</h1>
            </div>
            
          {/* Note content */}
<div className="p-4 md:p-6">
  <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
    {/* Left section - Title and dates */}
    <div className="flex-grow mb-2 md:mb-0">
      <h2 className="text-xl md:text-2xl font-bold mb-1">{note.title}</h2>
      <div className="text-xs md:text-sm text-gray-500 space-y-0.5">
        <p>
          Utworzono: {moment(note.createdOn).format('DD MMM YYYY, HH:mm')}
        </p>
        {note.updatedOn && note.updatedOn !== note.createdOn && (
          <p>
            Zaktualizowano: {moment(note.updatedOn).format('DD MMM YYYY, HH:mm')}
          </p>
        )}
      </div>
    </div>

    {/* Right section - Action buttons */}
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Icon buttons */}
      <div className="flex items-center gap-1">
        <button 
          onClick={updateIsPinned}
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
            note.isPinned ? "text-blue-700" : "text-gray-400"
          }`}
          title={note.isPinned ? "Odepnij notatkę" : "Przypnij notatkę"}
        >
          <MdOutlinePushPin className="text-xl md:text-2xl" />
        </button>
        
        <button 
          onClick={() => setOpenEditModal(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-green-600"
          title="Edytuj notatkę"
        >
          <MdCreate className="text-xl md:text-2xl" />
        </button>
        
        <button 
          onClick={deleteNote}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
          title="Usuń notatkę"
        >
          <MdDelete className="text-xl md:text-2xl" />
        </button>
      </div>

      {/* Text buttons with responsive labels */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={generateSummary}
          className="p-2 px-2 md:px-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1"
          title="Skróć notatkę"
          disabled={summaryLoading}
        >
          {summaryLoading ? (
            <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            <MdOutlineAutoAwesomeMotion className="text-xl" />
          )}
          <span className="hidden md:inline">Skróć notatkę</span>
        </button>

        <button 
          onClick={generateQuiz}
          className="p-2 px-2 md:px-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1"
          title="Stwórz test z notatki"
          disabled={quizLoading}
        >
          {quizLoading ? (
            <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            <MdQuiz className="text-xl" />
          )}
          <span className="hidden md:inline">Test z notatki</span>
        </button>
      </div>
    </div>
  </div>

              
              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Note content - zawsze renderuj jako Markdown */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-gray-800">
                <div className="markdown-body">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                  >
                    {cleanMarkdownContent(note.content)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Nie można znaleźć notatki</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Wróć do strony głównej
            </button>
          </div>
        )}
      </div>

      {(summaryLoading || summary) && (
  <div className="mt-8">
    <h3 className="font-bold text-lg mb-3 border-b pb-2">Streszczenie notatki</h3>
    
    {summaryLoading ? (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    ) : summary ? (
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
        >
          {cleanMarkdownContent(summary)}
        </ReactMarkdown>
      </div>
    ) : null}
  </div>
)}

{(quizLoading || quizQuestions.length > 0) && (
  <div className="mt-8">
    <h3 className="font-bold text-lg mb-3 border-b pb-2">Test z notatki</h3>
    
    {quizLoading ? (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
      </div>
    ) : quizQuestions.length > 0 ? (
      <div className="space-y-6">
        {quizQuestions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-base mb-3">{qIndex + 1}. {question.question}</h4>
            <div className="space-y-2 ml-4">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border ${
                    oIndex === question.correctAnswer 
                      ? "bg-green-100 border-green-500" 
                      : "bg-white border-gray-300"
                  }`}>
                    {oIndex === question.correctAnswer && (
                      <div className="w-3 h-3 bg-green-500 rounded-full m-auto"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : null}
  </div>
)}
      
      {/* Edit Modal */}
      <Modal 
        isOpen={openEditModal}
        onRequestClose={() => setOpenEditModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          },
          content: {
            maxWidth: '90%',
            width: '600px',
            margin: 'auto',
            borderRadius: '8px',
            maxHeight: '90vh',
          }
        }}
        contentLabel="Edytuj notatkę"
        className="w-[90%] max-w-xl max-h-[90vh] bg-white rounded-md mx-auto mt-14 p-4 sm:p-5 overflow-auto"
      >
        <AddEditNotes
          type="edit"
          noteData={note}
          onClose={() => {
            setOpenEditModal(false);
            fetchNoteDetails(); // Refresh note data after edit
          }}
          getAllNotes={() => {}}
        />
      </Modal>
      
      <ToastContainer />
    </>
  );
};

export default NoteDetail;