/* Copyright 2021, Prosemirror Adapter by Mirone. */
import '@examples/shared/lib/style.css';
import './Editor.css';

import { createEditorView } from '@examples/shared';
import { useNodeViewFactory } from '@prosemirror-adapter/react';
import { EditorView } from 'prosemirror-view';
import { FC, useCallback, useRef } from 'react';

import { Heading } from './Heading';
import { Paragraph } from './Paragraph';

export const Editor: FC = () => {
    const viewRef = useRef<EditorView>();
    const nodeViewFactory = useNodeViewFactory();

    const editorRef = useCallback(
        (element: HTMLDivElement) => {
            if (!element) return;

            if (element.firstChild) return;

            viewRef.current = createEditorView(element, {
                paragraph: nodeViewFactory({
                    component: Paragraph,
                    as: 'div',
                    contentAs: 'p',
                }),
                heading: nodeViewFactory({
                    component: Heading,
                }),
            });
        },
        [nodeViewFactory],
    );

    return <div className="editor" ref={editorRef} />;
};