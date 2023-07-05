import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import NewNote from './components/NewNote'
import { useLocalStorage } from './hooks/localstoragehook'
import { useMemo } from 'react'
import { v4 as uuidV4 } from "uuid"
import NoteLayout from './components/NoteLayout'
import Note from './components/Note'
import EditNote from './components/EditNote'

export type Note = {
  id: string
} & NoteData

export type Tag = {
  id: string,
  label: string
}
export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[]
}
export type RawNote = {
  id: string
} & RawNoteData;
export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[]
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('notes', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('tags', []);

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {
        ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  }
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note;
        }
      })
    })
  }
  function onDeleteNote(id: string) {
    setNotes(prevNote => {
      return prevNote.filter(note => {
        return note.id !== id;
      })
    })
  }
  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag]);
  }

  return (
    <Router>
      <Container className='my-4'>
        <Routes>
          <Route path='/' element=
            {<Home availableTags={tags} notes={notesWithTags} />} />
          <Route path='/new' element={<NewNote
            onSubmit={onCreateNote}
            onAddTag={addTag}
            availableTags={tags} />} />
          <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<Note onDeleteNote={onDeleteNote} />} />
            <Route path='edit' element={<EditNote
              onSubmit={onUpdateNote}
              onAddTag={addTag}
              availableTags={tags} />} />
          </Route>
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router >
  )
}




export default App
