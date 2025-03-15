import React, {useState, useEffect} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import Calendar from '../../components/Calendar/Calendar' // Nowy import kalendarza
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
import { FaCalendarAlt } from "react-icons/fa"; // Dodany import ikony kalendarza

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
    const [filteredNotes, setFilteredNotes] = useState([]); // Dodane dla filtrowania po dacie
    const [isDateFiltered, setIsDateFiltered] = useState(false); // Flaga czy jest aktywny filtr daty
    const [showCalendar, setShowCalendar] = useState(false); // Stan pokazywania/ukrywania kalendarza
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    
    useEffect(() => {
        if (location.state?.searchQuery) {
            onSearchNote(location.state.searchQuery);
           
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
                // Jeśli aktywny jest filtr daty, odfiltruj ponownie
                if (isDateFiltered && filteredNotes.length > 0) {
                    const firstNote = filteredNotes[0];
                    const noteDate = new Date(firstNote.createdOn);
                    noteDate.setHours(0, 0, 0, 0);
                    
                    const endOfDay = new Date(noteDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    
                    const filtered = response.data.notes.filter(note => {
                        const date = new Date(note.createdOn);
                        return date >= noteDate && date <= endOfDay;
                    });
                    
                    setFilteredNotes(filtered);
                }
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
            // Anuluj filtrowanie po dacie, gdy szukamy
            setIsDateFiltered(false);
            
            const response = await axiosInstance.get("/search-notes", {
                params: { 
                    q: query.trim()
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
        setIsDateFiltered(false); // Reset filtra daty także
        getAllNotes();
    };
    
    // Przełączanie widoczności kalendarza
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);

    };

    useEffect(() => {
        getAllNotes();
        getuserinfo();
       
        return () => {
           // Cleanup if needed
        };
    }, []);

    // Wybierz, które notatki wyświetlić - przefiltrowane czy wszystkie
    const displayNotes = isDateFiltered ? filteredNotes : allNotes;

    return (
        <>
            <Navbar userInfo={userInfo} handleClearSearch={handleClearSearch} onSearchNote={onSearchNote} />
            
            <div className='container mx-auto px-4 sm:px-6'>
                {/* Przycisk przełączania kalendarza */}
                <div className="flex justify-end mt-4 relative z-10">
    <button 
        className="px-4 py-2 flex items-center bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 transition-colors duration-300 z-20"
        onClick={toggleCalendar}
    >
        <FaCalendarAlt className="mr-2" />
        {showCalendar ? 'Ukryj kalendarz' : 'Pokaż kalendarz'}
    </button>
</div>
                {/* Kalendarz - widoczny tylko gdy showCalendar jest true */}
                {showCalendar && (
    <div className="relative z-0"> 
        <Calendar 
            setFilteredNotes={setFilteredNotes} 
            setIsDateFiltered={setIsDateFiltered} 
            allNotes={allNotes} 
        />
    </div>
)}
                
                {/* Informacja o filtrze daty */}
                {isDateFiltered && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex justify-between items-center">
                        <p className="text-blue-700">
                            Pokazuję notatki z dnia: {filteredNotes.length > 0 ? 
                                new Date(filteredNotes[0].createdOn).toLocaleDateString('pl-PL', 
                                { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </p>
                        <button 
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 text-sm"
                            onClick={() => {
                                setIsDateFiltered(false);
                                setFilteredNotes([]);
                            }}
                        >
                            Wyczyść filtr
                        </button>
                    </div>
                )}
                
                {/* Lista notatek */}
                {displayNotes.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                        {displayNotes.map((item) => (
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
                        imgSrc={isSearch ? NoDataImg : (isDateFiltered ? NoDataImg : AddNotesImg)}
                        message={
                            isSearch 
                                ? 'Brak takich notatek' 
                                : (isDateFiltered 
                                    ? 'Brak notatek w tym dniu' 
                                    : "Rozpocznij tworzyć swoje notatki! Po prostu kliknij guzik Dodaj i JUŻ! Ja ci w tym wszystkim pomogę!!")
                        }
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
                className="w-[90%] max-w-xl max-h-[90vh] bg-white rounded-md mx-auto mt-14 p-4 sm:p-5 overflow-auto z-2"
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
    );
}

export default Home