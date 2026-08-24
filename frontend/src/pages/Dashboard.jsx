import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Navbar } from '../components/Navbar';
import { NoteEditorModal } from '../components/NoteEditorModal';
import { Plus, Search, Edit3, Trash2, Calendar, FileText } from 'lucide-react';

export const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notes?limit=100');
      if (res.data.success) {
        setNotes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSaveNote = async (noteData) => {
    if (selectedNote) {
      await API.put(`/notes/${selectedNote.id}`, noteData);
    } else {
      await API.post('/notes', noteData);
    }
    fetchNotes();
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await API.delete(`/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Notes</h1>
            <p className="text-sm text-slate-500">Manage, organize, and capture your notes seamlessly.</p>
          </div>

          <button
            onClick={() => {
              setSelectedNote(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow transition"
          >
            <Plus className="w-4 h-4" />
            Create Note
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title or content..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-xs"
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No notes found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              {search ? 'Try adjusting your search query' : 'Get started by creating your first note!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg line-clamp-1 mb-2">
                    {note.title}
                  </h3>
                  <div
                    className="text-slate-600 text-sm line-clamp-4 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition"
                      title="Edit Note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 transition"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <NoteEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        initialNote={selectedNote}
      />
    </div>
  );
};