/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import Spinner from '../atoms/Spinner';
import HttpErrorAlert from '../atoms/HttpErrorAlert';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import Modal from '../atoms/Modal';
import LinkLogToRun from '../atoms/LinkLogToRun';
import SuccessMessage from '../atoms/SuccessMessage';
import { store } from '../redux/configureStore';
import { fetchRun } from '../redux/ducks/run/operations';
import { selectIsFetchingRun, selectIsPatchingLinkLogToRun, selectCurrentRun } from '../redux/ducks/run/selectors';
import Card from '../atoms/Card';
import DescriptionList from '../atoms/DescriptionList';
import RunDescription from '../constants/RunDescription';
import Button, { ButtonClass, ButtonSize } from '../atoms/Button';
import TabContainer from '../molecules/TabContainer';
import Table from '../molecules/Table';
import LogColumns from '../constants/LogColumns';
import { selectTags, selectTagsForRun, selectFetchingTags } from '../redux/ducks/tag/selectors';
import { Tag } from '../interfaces/Tag';
import FormGroup from '../molecules/FormGroup';
import Label from '../atoms/Label';
import Select from '../atoms/Select';
import Input from '../atoms/Input';

interface Attrs {
    runNumber: number;
}

type Vnode = m.Vnode<Attrs, Run>;
type VnodeDOM = m.VnodeDOM<Attrs, Run>;

export default class Run extends MithrilTsxComponent<Attrs> {
    oninit(vnode: VnodeDOM) {
        store.dispatch(fetchRun(vnode.attrs.runNumber));
    }

    linkingButton(addExistingRunId: string, runNumber: number) {
        return (
            <div class="row justify-content-end">
                <Button
                    buttonClass={ButtonClass.SUCCESS}
                    buttonSize={ButtonSize.SMALL}
                    margin="mr-1"
                    onClick={() => m.route.set(
                        `/logs/create/runs/${runNumber}`
                    )}
                    text={'Add new log to run'}
                />
                <Modal id={addExistingRunId} title="Link existing log" buttonClass="btn btn-primary">
                    <LinkLogToRun runNumber={runNumber} />
                </Modal>
            </div>
        );
    }

    async handleSubmit(event: any): Promise<void> {
        // TODO
    }

    view(vnode: Vnode) {
        const addExistingRunId = 'add-existing-run';
        const state = store.getState();
        const currentRun = selectCurrentRun(state);
        const isFetchingRun = selectIsFetchingRun(state);
        const isPatchingLinkLogToRun = selectIsPatchingLinkLogToRun(state);
        const tagsForRun = selectTagsForRun(store.getState());
        const tags = selectTags(store.getState());
        return (
            <div class="container-fluid">
                <Spinner
                    isLoading={isFetchingRun || isPatchingLinkLogToRun}
                >
                    <SuccessMessage />
                    <HttpErrorAlert>
                        <div class="row">
                            <div class="col-md-12 mx-auto">
                                <Card
                                    className={'shadow-sm bg-light'}
                                    headerTitle={'Run'}
                                    headerContent={
                                        this.linkingButton(addExistingRunId, vnode.attrs.runNumber)
                                    }
                                    footerContent={(
                                        <TabContainer titles={['Logs', 'Tags']} >
                                            {
                                                currentRun && currentRun.logs.length > 0
                                                    ? <Table data={currentRun.logs} columns={LogColumns} />
                                                    : 'This run has no logs'
                                            }
                                            {
                                                <div>
                                                    <h3>Currently added tags:</h3>
                                                    <ul>
                                                        {tagsForRun && tagsForRun.map((tag: Tag) =>
                                                            <li key={tag.id}>
                                                                <a
                                                                    id={tag.id}
                                                                    href={m.route.set(`/Logs?tagId=${tag.id}`)}
                                                                    title="Click to search for logs with this tag."
                                                                >
                                                                    {tag.tagText}
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    <hr />
                                                    <h3>Add a Tag to this log:</h3>
                                                    <form
                                                        onsubmit={(event: Event) => {
                                                            event.preventDefault();
                                                            this.handleSubmit(event);
                                                        }}
                                                    >
                                                        <FormGroup
                                                            label={(
                                                                <Label id="tag" text="Select an existing tag:" />
                                                            )}
                                                            field={(
                                                                <div>
                                                                    <Spinner
                                                                        isLoading={selectFetchingTags(
                                                                            store.getState())}
                                                                        small
                                                                    >
                                                                        <Select
                                                                            id="tag"
                                                                            className="form-control"
                                                                            name="tag"
                                                                            required
                                                                            hidden={tags.length === 0}
                                                                            optionValue="id"
                                                                            optionText="tagText"
                                                                            options={tags}
                                                                            defaultOption="Please select a Tag."
                                                                            data-live-search={true}
                                                                        />
                                                                        {/* Below div could become an *alert* atom */}
                                                                        <div
                                                                            class="alert alert-warning"
                                                                            role="alert"
                                                                            hidden={tags.length > 0}
                                                                        >No Tags found. Please create a new Tag above.
                                                                        </div>
                                                                    </Spinner>
                                                                </div>
                                                            )}
                                                        />
                                                        <FormGroup
                                                            label={(
                                                                <Label
                                                                    autofocus="autofocus"
                                                                    id="description"
                                                                    text="Add new tag:"
                                                                />
                                                            )}
                                                            field={(
                                                                <Input
                                                                    id="tagText"
                                                                    inputType="text"
                                                                    autofocus="autofocus"
                                                                    className="form-control"
                                                                    required={true}
                                                                />
                                                            )}
                                                        />
                                                    </form>
                                                </div>
                                            }
                                        </TabContainer>
                                    )}
                                >
                                    <DescriptionList
                                        descriptions={RunDescription}
                                        entity={currentRun}
                                        listLength={7}
                                    />
                                </Card>
                            </div>
                        </div>
                    </HttpErrorAlert >
                </Spinner >
            </div >
        );
    }
}
