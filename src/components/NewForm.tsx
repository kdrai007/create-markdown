/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, FormEvent, useState } from 'react';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom";
import CreateSelect from "react-select/creatable";
import { NoteData, Tag } from '../App';
import { v4 as uuidV4 } from "uuid"


type NewNoteProps = {
    submitedData: (data: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
} & Partial<NoteData>

const NewForm = ({ submitedData, onAddTag, availableTags, title = "", markdown = "", tags = [] }: NewNoteProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const navigate = useNavigate();
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        submitedData({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        })
        navigate("..");
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control defaultValue={title} ref={titleRef} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Title</Form.Label>
                            <CreateSelect
                                onCreateOption={label => {
                                    const newTag = { id: uuidV4(), label }
                                    onAddTag(newTag);
                                    setSelectedTags(prev =>
                                        [...prev, newTag]
                                    );
                                }}
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
                <Form.Group controlId='markdown'>
                    <Form.Label>Body</Form.Label>
                    <Form.Control ref={markdownRef} defaultValue={markdown} required as="textarea" rows={15} />
                </Form.Group>
                <Stack direction='horizontal' gap={2} className="justify-content-end">
                    <Button type='submit' variant='primary'>Save</Button>
                    <Link to="..">
                        <Button type='button' variant="outline-secondary">Cancel</Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}

export default NewForm 