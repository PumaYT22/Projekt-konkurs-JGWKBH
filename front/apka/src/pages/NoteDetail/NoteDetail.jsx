import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from 'moment'
import { MdOutlinePushPin, MdCreate, MdDelete, MdArrowBack } from 'react-icons/md'
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
  
  // Fetch note details
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

  // Get user info
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

  // Update isPinned status
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

  // Delete note
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

  // Wyczyść kod Markdown z ograniczników, jeśli istnieją
  const cleanMarkdownContent = (content) => {
    if (content && typeof content === 'string') {
      // Usuń otoczenie ```markdown z dowolnymi białymi znakami
      content = content.replace(/^```markdown\s*/gm, '');
      content = content.replace(/\s*```$/gm, '');
      // Usuń ogólne otoczenie ``` (dowolny język)
      content = content.replace(/^```\s*\w*\s*/gm, '');
      content = content.replace(/\s*```$/gm, '');
      return content;
    }
    return content || "";
  };

  // Dodaj własne style CSS dla Markdown
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
      
      {/* Dodaj własne style CSS */}
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
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{note.title}</h2>
                  <p className="text-sm text-gray-500">
                    Utworzono: {moment(note.createdOn).format('DD MMMM YYYY, HH:mm')}
                  </p>
                  {note.updatedOn && note.updatedOn !== note.createdOn && (
                    <p className="text-sm text-gray-500">
                      Zaktualizowano: {moment(note.updatedOn).format('DD MMMM YYYY, HH:mm')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={updateIsPinned}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                      note.isPinned ? "text-blue-700" : "text-gray-400"
                    }`}
                    title={note.isPinned ? "Odepnij notatkę" : "Przypnij notatkę"}
                  >
                    <MdOutlinePushPin className="text-2xl" />
                  </button>
                  
                  <button 
                    onClick={() => setOpenEditModal(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-green-600"
                    title="Edytuj notatkę"
                  >
                    <MdCreate className="text-2xl" />
                  </button>
                  
                  <button 
                    onClick={deleteNote}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
                    title="Usuń notatkę"
                  >
                    <MdDelete className="text-2xl" />
                  </button>
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