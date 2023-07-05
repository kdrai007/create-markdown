import { NoteData, Tag } from '../App'
import NewForm from './NewForm'

export type NewNoteProps = {
    onSubmit: (data: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
}

const NewNote = ({ onSubmit, onAddTag, availableTags }: NewNoteProps) => {
    return (
        <div>
            <h1> NewNote</h1>
            <NewForm submitedData={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
        </div>
    )
}

export default NewNote