import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Stack, Modal } from 'react-bootstrap'
import { Link } from "react-router-dom";
import ReactSelect from "react-select"
import { Tag } from '../App';
import styles from "../Notelist.module.css";

type EditTagsProps = {
    show: boolean;
    handleClose: () => void;
    availableTags: Tag[];
    onDeleteTag: (id: string) => void;
    onUpdateTag: (id: string, label: string) => void;
}

type SimplifiedNote = {
    title: string;
    id: string
    tags: Tag[];
}
type NoteListProps = {
    availableTags: Tag[];
    notes: SimplifiedNote[];
    onDeleteTag: (id: string) => void;
    onUpdateTag: (id: string, label: string) => void;
}

const Home = ({ availableTags, notes, onDeleteTag, onUpdateTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag =>
                        note.tags.some(noteTag => noteTag.id === tag.id)
                    ))
            )
        })
    }, [title, selectedTags, notes])
    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col><h1>Notes</h1></Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant='primary'>Create</Button>
                        </Link>
                        <Button onClick={() => setEditModalIsOpen(true)} variant='outline-secondary'>Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control value={title} onChange={e => setTitle(e.target.value)} type="text" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Title</Form.Label>
                            <ReactSelect

                                value={selectedTags?.map(tag => { return { label: tag.label, value: tag.id } })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }} isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} xxl={5} className='g-3'>
                {
                    filteredNotes.map((note) => {
                        return <Col key={note.id}>
                            <NoteCard id={note.id} title={note.title} tags={note.tags} />
                        </Col>
                    })
                }
            </Row>
            <EditTagsModal onUpdateTag={onUpdateTag} availableTags={availableTags} onDeleteTag={onDeleteTag} show={editModalIsOpen} handleClose={() => setEditModalIsOpen(false)} />
        </>
    )
}


function NoteCard({ id, title, tags }: SimplifiedNote) {
    return <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
        <Card.Body>
            <Stack gap={2} className='align-items-center justify-content-center h-100'>
                <span className="fs-5">{title}</span>
                {tags.length > 0 && (<Stack gap={1} direction='horizontal' className='justify-content-center flex-wrap'>
                    {tags.map(tag => (
                        <Badge className='text-truncate' key={tag.id}>{tag.label}</Badge>
                    ))}
                </Stack>)}
            </Stack>
        </Card.Body>
    </Card>
}

function EditTagsModal({ availableTags, show, handleClose, onDeleteTag, onUpdateTag }: EditTagsProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control onChange={(e) => onUpdateTag(tag.id, e.target.value)} type="text" value={tag.label} />
                                </Col>
                                <Col xs="auto">
                                    <Button variant='outline-danger' onClick={() => onDeleteTag(tag.id)} >&times;</Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default Home