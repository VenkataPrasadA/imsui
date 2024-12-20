import { useCallback, useEffect, useState } from "react";
import { getQmVersionRecordDtoList } from "../../../services/qms.service";
import Datatable from "../../datatable/Datatable";
import withRouter from '../../../common/with-router';
import { IconButton } from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import "./qm-revisionrecords.component.css"
import QmDocPrint from "../../prints/qms/qm-doc-print";
import { format } from "date-fns";
import AddDocumentSummaryDialog from "./qm-add-document-summary-dialog";
import QmAddMappingOfClassesDialog from "./qm-add-mapping-of-classes-dialog";


const QmRevisionRecordsComponent = ({ router }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versionRecordList, setVersionRecordList] = useState([]);
  const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openMocDialog, setOpenMocDialog] = useState(false);
  const [singleDoc, setSingleDoc] = useState(null);


  const { navigate, location } = router;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('roleId')
        const roleName = localStorage.getItem('roleName')
        const empId = localStorage.getItem('empId')
        console.log('roleName',roleName);
        
        const VersionRecorList = await getQmVersionRecordDtoList();
        const mappedData = VersionRecorList.map((item, index) => ({
          sn: index + 1,
          description: item.description || '-' || '-',
          // from: 'V' + item[5] + '-R' + item[6] || '-',
          from: index + 1 < VersionRecorList.length ? 'I' + VersionRecorList[index + 1].issueNo + '-R' + VersionRecorList[index + 1].revisionNo : '--',
          to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
          issueDate: item.dateOfRevision,
          issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
          status: item.statusCode || '--',
          action: (
            <div>
              {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
                <>
                  <button className="icon-button edit-icon-button me-1" onClick={() => redirecttoQmDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
                  {/* <button className="btn summary-btn-outline btn-sm"  onClick={() => {
                                  // setOpenDialog2(true);
                                  setSingleDoc(item);
                              }} title="Document Summary"> <i className="material-icons" >summarize</i></button> */}
                  {getDocPDF('', item)}
                  <button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => { setSingleDoc(item); setOpenDialog2(true) }} title="Document Summary"> <i className="material-icons"  >summarize</i></button>
                  <button className="icon-button me-1" style={{color: '#ea5753'}} title="Mapping Of Clauses" onClick={()=>addMappingOfClasses(item)} > <i className="material-icons"  >table_chart</i></button>
                  {/* {roleName && roleName.trim() === 'MR Rep' ? (
                  <button className="icon-button me-1" style={{color: 'green'}} title="Forward">
                   <i className="material-icons">fast_forward</i>
                    </button>
                  ) : " "} */}

                </>
              )}
            </div>
          ),
        }));

        setVersionRecordPrintList(mappedData);
        setVersionRecordList(VersionRecorList);
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getDocPDF = (action, revisionElements) => {
    return <QmDocPrint action={action} revisionElements={revisionElements} />
  }

  const redirecttoQmDocument = useCallback((element) => {
    navigate('/qm-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const handleCloseDocSummaryDialog = () => {
    setOpenDialog2(false)
    setSingleDoc(null);
  };

  const handleCloseMocDialog = () => {
    setOpenMocDialog(false)
    setSingleDoc(null);
  };

  const addMappingOfClasses = (item) => {
    setOpenMocDialog(true)
    setSingleDoc(item)
    // return <QmAddMappingOfClassesDialog open={openMovDialog} onClose={handleCloseMocDialog} revisionRecordId={revisionRecordId}/>;
  };


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
    { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
  ];

  return (

    <div className="card">
      <Navbar />
      <div className="card-body">
        <h3>QM - Revision Record </h3>
        <div id="card-body customized-card">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <h3 color="error">{error}</h3>
          ) : (
            <Datatable columns={columns} data={versionRecordPrintList} />
          )}
        </div>
      </div>
      <AddDocumentSummaryDialog
        open={openDialog2}
        onClose={handleCloseDocSummaryDialog}
        revisionElements={singleDoc}
      // onConfirm={handleDocSummaryConfirm}
      />

      {openMocDialog && (
        <QmAddMappingOfClassesDialog
          open={openMocDialog}
          onClose={handleCloseMocDialog}
          revisionRecordId={singleDoc.revisionRecordId}
        />
      )}

    </div>

  )

}

export default withRouter(QmRevisionRecordsComponent);