import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllConsultsUrl, getUserUrl } from 'Api';
import { fetchWithToken, fetchWithUser } from 'Util/fetch';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Spinner from 'Components/Spinner';
import getColumns from './getColumns';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import styles from './ConsultDashboard.module.css';

const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

const customTotal = (from: number, to: number, size: number) => (
  <span className='react-bootstrap-table-pagination-total'>
    &nbsp; Showing Consults {from} to {to} of {size}
  </span>
);

const pagination = paginationFactory({
  firstPageText: '<<',
  prePageText: '<',
  nextPageText: '>',
  lastPageText: '>>',
  sizePerPage: 10,
  showTotal: true,
  paginationTotalRenderer: customTotal,
  alwaysShowAllBtns: true,
});

const { REACT_APP_CONSULT_API_KEY, REACT_APP_MANAGEMENT_API_KEY } = process.env;

function ConsultDashboard({ history }: RouteComponentProps) {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const { data: userData } = useSWR(
    [getUserUrl, REACT_APP_MANAGEMENT_API_KEY, 'POST', user_id],
    fetchWithUser
  );

  const role = JSON.parse(userData.body).role.toUpperCase();

  const { data: consults, error } = useSWR(
    [getAllConsultsUrl({ user_id }), REACT_APP_CONSULT_API_KEY],
    fetchWithToken
  );

  if (!consults) return <Spinner />;
  if (error)
    return <h1 style={{ textAlign: 'center' }}>Error retrieving consults.</h1>;

  return (
    <>
      <BreadcrumbBar page='Consult Dashboard' />
      <Container className={styles.container}>
        <ToolkitProvider
          bootstrap4
          keyField='id'
          data={consults}
          columns={getColumns(history, role)}
          search={{
            searchFormatted: true,
          }}
          exportCSV={{
            onlyExportFiltered: true,
          }}
        >
          {({ searchProps, baseProps, csvProps }) => (
            <>
              <div className={styles.controls}>
                <SearchBar {...searchProps} />
                <ClearSearchButton />
                <ExportCSVButton {...csvProps}>Export to CSV</ExportCSVButton>
              </div>
              <hr />
              <BootstrapTable
                pagination={pagination}
                filter={filterFactory()}
                {...baseProps}
              />
            </>
          )}
        </ToolkitProvider>
      </Container>
    </>
  );
}

export default withRouter(ConsultDashboard);
