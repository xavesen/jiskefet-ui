/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 * The tabs used by the Log details page.
 */

import * as m from 'mithril';
import { Description } from '../interfaces/Description';
import { format } from 'date-fns';
import { Log } from '../interfaces/Log';

/**
 * The tab information used by the TabHeader and TabContent of the Log detail page.
 */
const LogDescription: Description[] = [
    {
        label: 'Log id',
        value: (log: Log): number => {
            return log.logId;
        }
    },
    {
        label: 'Subtype',
        value: (log: Log): JSX.Element => (
            <span
                class={`badge ${
                    log.subtype === 'run' ?
                        'badge-warning' :
                        'badge-primary'
                    }`}
            >
                {log.subtype}
            </span>
        )
    },
    {
        label: 'Origin',
        value: (log: Log): JSX.Element => (
            <span
                class={`badge ${
                    log.origin === 'human' ?
                        'badge-success' :
                        'badge-primary'}`}
            >
                {log.origin}
            </span>
        )
    },
    {
        label: 'Creation time',
        value: (log: Log): string => {
            return format(log.creationTime, 'HH:mm:ss DD/MM/YYYY');
        }
    },
    {
        label: 'Author',
        value: (log: Log): number => {
            return log.user &&
            log.user.userId;
        }
    }
];

type LogDescription = typeof LogDescription;
export default LogDescription;
