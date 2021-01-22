import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithToken } from '../../Util/fetch';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Loading from '../../Components/Loading/Loading';
import getColumns from './getColumns';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './react-bootstrap-table-overrides.css';

const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;
const pagination = paginationFactory({
  lastPageText: '>>',
  sizePerPage: 10,
  firstPageText: '<<',
  nextPageText: '>',
  prePageText: '<',
  showTotal: true,
  alwaysShowAllBtns: true,
});

function ConsultDashboard({ history }: RouteComponentProps) {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const { data: consultList } = useSWR(
    [
      `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-all?user_id=${user_id}`,
      awsToken,
    ],
    fetchWithToken
  );

  return (
    <Container className='mb-5 text-center'>
      <h1>Consult Dashboard</h1>
      {consultList ? (
        <ToolkitProvider
          bootstrap4
          keyField='id'
          data={consultList}
          columns={getColumns(history)}
          search={{
            searchFormatted: true,
          }}
          exportCSV={{
            onlyExportFiltered: true,
          }}
        >
          {({ searchProps, baseProps, csvProps }) => (
            <div>
              <SearchBar {...searchProps} />
              <ClearSearchButton />
              <ExportCSVButton {...csvProps}>Export to CSV</ExportCSVButton>
              <hr />
              <BootstrapTable pagination={pagination} {...baseProps} />
            </div>
          )}
        </ToolkitProvider>
      ) : (
        <Loading />
      )}
    </Container>
  );
}

export default withRouter(ConsultDashboard);