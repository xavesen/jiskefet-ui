/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import SubsystemOverviewColumns from '../constants/SubsystemOverviewColumns';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import HttpErrorAlert from '../components/HttpErrorAlert';
import SuccessMessage from '../components/SuccessMessage';
import Table from '../components/Table';
import ContentBlock from '../components/ContentBlock';
import Spinner from '../components/Spinner';
import { Event } from '../interfaces/Event';
import { fetchSubsystemOverviews } from '../redux/ducks/subsystem/operations';
import { store } from '../redux/configureStore';
import { selectFetchingSubsystemOverviews, selectSubsystemOverviews } from '../redux/ducks/subsystem/selectors';
import { setFiltersFromUrl, switchOrderBy } from '../redux/ducks/filter/operations';
import { FilterName } from '../interfaces/Filter';
import { selectQueryString, selectFilters } from '../redux/ducks/filter/selectors';
import { setQueryParams } from '../utility/UrlUtil';
import { setFilter } from '../redux/ducks/filter/actions';
import { OrderDirection } from '../enums/OrderDirection';

export default class SubsystemsOverview extends MithrilTsxComponent<{}> {

    oninit() {
        store.dispatch(setFiltersFromUrl(FilterName.Subsystem));
        this.setQueryAndFetch();
    }

    /**
     * Fetch subsystems with the filters currently in the state.
     */
    fetchWithFilters = (): void => {
        const queryString = selectQueryString(store.getState())(FilterName.Subsystem);
        store.dispatch(fetchSubsystemOverviews(queryString));
    }

    /**
     * Set the query parameters in the url and fetch with the filters in the current state.
     */
    setQueryAndFetch = (): void => {
        const subsystemFilters = selectFilters(store.getState())[FilterName.Subsystem];
        setQueryParams(subsystemFilters);
        this.fetchWithFilters();
    }

    view() {
        const timeRanges = [24, 48, 72, 96];
        const subsystemFilters = selectFilters(store.getState())[FilterName.Subsystem];
        return (
            <div>
                <HttpErrorAlert>
                    <SuccessMessage />
                    <div class="row">
                        <div class="col-md-9">
                            <ContentBlock class="col-sm-3 mb-2">

                                <label
                                    for="timeRange"
                                    class="col-form-label col-form-label-sm"
                                >
                                    Time range in hours.
                                </label>
                                <select
                                    id="timeRange"
                                    class="form-control form-control-sm"
                                    name="timeRange"
                                    onchange={(event: Event) => {
                                        store.dispatch(setFilter(
                                            FilterName.Subsystem,
                                            'timeRange',
                                            event.target.value
                                        ));
                                        this.setQueryAndFetch();
                                    }}
                                    value={subsystemFilters.timeRange}
                                >
                                    {timeRanges.map((timeRange: number) =>
                                        <option key={timeRange} value={timeRange}>{timeRange}</option>
                                    )}
                                </select>

                            </ContentBlock>
                            <Spinner
                                isLoading={selectFetchingSubsystemOverviews(store.getState())}
                            >
                                <Table
                                    data={selectSubsystemOverviews(store.getState())}
                                    columns={SubsystemOverviewColumns}
                                    orderBy={subsystemFilters.orderBy || undefined}
                                    orderDirection={subsystemFilters.orderDirection || OrderDirection.Descending}
                                    onHeaderClick={(accessor: string) => {
                                        store.dispatch(switchOrderBy(FilterName.Subsystem, accessor));
                                        this.setQueryAndFetch();
                                    }}
                                />
                            </Spinner>
                        </div>
                    </div>
                </HttpErrorAlert>
            </div>
        );
    }
}
