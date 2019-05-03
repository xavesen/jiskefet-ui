/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import { ILog } from '../interfaces/Log';

interface Attrs {
    log: ILog;
    key: string | number;
}

type Vnode = m.Vnode<Attrs, Comment>;

export default class Comment extends MithrilTsxComponent<Attrs> {
    view(vnode: Vnode) {
        const { log, key } = vnode.attrs;
        return (
            <div>
                <li class="timeline-comment" key={key}>
                    <div class="timeline-comment-wrapper">
                        <div class="timeline-comment-header">
                            <div class="timeline-comment-header-text">
                                <div class="timeline-comment-author">
                                    <h5><a
                                        // href={m.route.set(`/Log/${log.logId}`)}
                                        href="#"
                                    >{log.title}
                                    </a> </h5>
                                    <div
                                        class="comment-date"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                    >{log.creationTime}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-comment-body">
                            <p class="mb-0">{log.body}</p>
                        </div>
                        <div class="timeline-comment-footer">
                            <a
                                // href={m.route.set(`/Log/Create/comments/${log.logId}`)}
                                href="#"
                                class="btn btn-sm btn-secondary"
                            >Reply
                            </a>
                        </div>
                    </div>
                </li>
                { // Sub-comments of comments
                    log.comments
                        ?
                        <ul class="timeline-comments">
                            {log.comments && log.comments.map((sublog: ILog) =>
                                <Comment
                                    log={sublog}
                                    key={sublog.logId}
                                />
                            )}

                        </ul>
                        : <div />
                }
            </div>
        );
    }
}