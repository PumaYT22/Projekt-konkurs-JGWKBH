import React, {useState, useEffect} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import {useNavigate, useLocation} from 'react-router-dom'
import Modal from 'react-modal'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import { ToastContainer, toast } from 'react-toastify';
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNotesImg from '../../assets/add-note.svg'
import NoDataImg from '../../assets/no-data.svg'
import { FaRobot } from "react-icons/fa6";

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShow: false,
        type: "add",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    });

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Check if there's a search query from the location state (when returning from note detail)
    useEffect(() => {
        if (location.state?.searchQuery) {
            onSearchNote(location.state.searchQuery);
            // Clear the state after using it
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({isShow: true, data: noteDetails, type: "edit"});
    };

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message: "",
            type,
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: ""
        });
    };

    // Get user info
    const getuserinfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if(response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch(error) {
            if(error.response?.status === 401) {
                localStorage.clear();
                navigate("/login"); 
            }
        }
    };

    // Get all notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if(response.data && response.data.notes) {
                setAllNotes([...response.data.notes]);
            }
        } catch (error) {
            console.log("Spróbuj ponownie");
        }
    };

    // Delete note
    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete("/delete-note/" + noteId);
    
            if(response.data && !response.data.error) {
                toast.error("Usunięto notatkę!");
                getAllNotes();
            }
        } catch(error) {
            if(error.response && error.response.data && error.response.data.message) {
              console.log("Spróbuj ponownie");
            }
        }
    };

    // Search notes
    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { 
                    query: query.trim()
                }
            });
                
            if (response.data.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.error("Błąd wyszukiwania:", error.response?.data?.message || error.message);
        }
    };

    // Update isPinned status
    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
               isPinned: !noteData.isPinned 
            });
    
            if(response.data && response.data.note) {
                toast.success("Zaktualizowano pinezkę!");
                getAllNotes();
            }
        } catch(error) {
           console.log(error);
        }
    };

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    };

    useEffect(() => {
        getAllNotes();
        getuserinfo();
       
        return () => {
           // Cleanup if needed
        };
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} handleClearSearch={handleClearSearch} onSearchNote={onSearchNote} />
    
            <div className='container mx-auto px-4 sm:px-6'>
               {allNotes.length > 0 ? (
                 <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
                    {allNotes.map((item) => (
                         <NoteCard
                            key={item._id}
                            id={item._id}
                            title={item.title}
                            date={item.createdOn}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => deleteNote(item)}
                            onPinNote={() => updateIsPinned(item)}
                         />
                    ))}
                 </div>
               ) : (
                 <EmptyCard 
                    imgSrc={isSearch ? NoDataImg : AddNotesImg}
                    message={isSearch ? 'Brak takich notatek' : "Rozpocznij tworzyć swoje notatki! Po prostu kliknij guzik Dodaj i JUŻ! Ja ci w tym wszystkim pomogę!!"}
                 />
               )}
            </div>
            <div style={{height:"60px"}}>
              {/* Spacer for better mobile experience */}
            </div>
    
            <button 
              className='w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full sm:rounded-2xl bg-blue-300 hover:bg-blue-600 fixed right-4 sm:right-10 bottom-4 sm:bottom-10 shadow-lg z-10 transition-all duration-300' 
              onClick={() => {
                  setOpenAddEditModal({isShow: true, type: "add", data: null})
              }}
            >
                <MdAdd className='text-2xl sm:text-3xl text-white' />
            </button>

            <button 
              className='w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full sm:rounded-2xl bg-red-300 hover:bg-red-600 fixed left-4 sm:left-10 bottom-4 sm:bottom-10 shadow-lg z-10 transition-all duration-300' 
              onClick={() => {
                  navigate("/rozmowa")
              }}
            >
                <FaRobot className='text-2xl sm:text-3xl text-white' />
            </button>
            
            <Modal 
                isOpen={openAddEditModal.isShow}
                onRequestClose={() => {
                    setOpenAddEditModal({isShow: false, type: "add", data: null})
                }}
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
                contentLabel=""
                className="w-[90%] max-w-xl max-h-[90vh] bg-white rounded-md mx-auto mt-14 p-4 sm:p-5 overflow-auto"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({isShow: false, type: "add", data: null})
                    }}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>
            
            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
            <ToastContainer />
        </>
      )
}

export default Home