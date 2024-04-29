
import { DataGrid } from '@mui/x-data-grid';
import adminDatajson from './../data_folders/adminData.json'
import { useEffect, useState } from 'react';
import admstyles from './css-folder/AdminPage.module.css'
import OfPerson from './OfAPerson';
import EditDetailsOfPerson from './EditDetailsOfPerson';
import LeavesApproval from './LeavesApproval';
export default function AdminPage() {

    let [empData, setEmpData] = useState([]);
    let [editRowData, setEditRowData] = useState([]);
    let [AttendanceData, setAttendanceData] = useState([]);

    let [viewStatsData, setViewStatsData] = useState([]);







    let [showAdminPage, setShowAdminPage] = useState(true);
    let [showPersonPage, setShowPersonPage] = useState(false);
    let [showEditScreen, setShowEditScreen] = useState(false);
    let [showLeavesApprovalPage, setLeavesApprovalPage] = useState(false);

    // let [earnings]
    let columnHeaders = [
        { field: 'id', headerName: 's_no', flex: 1, align: 'center', headerAlign: 'center' },

        { field: 'employee_id', headerName: 'EMPOLOYEE ID', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'user_id', headerName: 'USER ID', flex: 1, align: 'center', headerAlign: 'center' },

        { field: 'total_hours_worked', headerName: 'Total Hours', flex: 1, align: 'center', headerAlign: 'center' },

        { field: 'earnings', headerName: 'earnings', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: "action", headerName: "Action", sortable: false, width: 150, fontSize: 12, fontWeight: 'bold',
            renderCell: (params) => {
              return (
                <div className={admstyles.viewButton}>
                  <a  onClick={() => { personStatsFunction(params.row) }}> VIEW STATS</a>
                 
                </div>
              )
            }
          },
          {
            field: "Edit", headerName: "EDIT PAYROLL", sortable: false, width: 150, fontSize: 12, fontWeight: 'bold',
            renderCell: (params) => {
              return (
                <div className={admstyles.viewButton}>
                  <a  onClick={() => { EditDetailsScreenFunction(params.row) }}> EDIT PAYROLL</a>
                 
                </div>
              )
            }
          },
          {
            field: "LEAVES", headerName: "LEAVES", sortable: false, width: 150, fontSize: 12, fontWeight: 'bold',
            renderCell: (params) => {
              return (
                <div className={admstyles.viewButton}>
                  <a  onClick={() => { LeavesApprovalScreenFunction(params.row) }}> LEAVES </a>
                 
                </div>
              )
            }
          }


    ]

    //     useEffect(()=>{

    //         let adminData=adminDatajson.map((e)=>{
    //             return {
    //                 ...e,
    //                 earnings: '$'+e.hours*10
    //             }
    //         })


    //    setEmpData(adminData);

    //     },[adminDatajson])

    let backtoAdminpage=()=>{
        setShowPersonPage(false);
        setShowEditScreen(false);
        setShowAdminPage(true);
        setLeavesApprovalPage(false);
    }

     let personStatsFunction=(params)=>{

      setEditRowData(params);

        console.log("##params",params);
        setShowPersonPage(true);
        setShowAdminPage(false);

     }

     let EditDetailsScreenFunction=(params)=>{

        console.log("##params",params);

        setEditRowData(params);
        setShowEditScreen(true);
        setShowAdminPage(false);
     }

     let LeavesApprovalScreenFunction=(params)=>{

      console.log("##params",params);

      setEditRowData(params);
      setShowEditScreen(false);
      setShowAdminPage(false);
      setLeavesApprovalPage(true);
   }

    let fetchAttendanceDetails = async () => {
        //https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/getEmployeeAttendanceDetails
        let response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/getEmployeeAttendanceDetails');
        let responseJson = await response.json();

        console.log("##attendance response", responseJson);
       setAttendanceData(responseJson);

           
        let index = 1;
        const groupedData = responseJson.reduce((groups, entry) => {
            const { user_id, employee_id, hours_worked,pay_scale,current_role_name } = entry;
            if (!groups[user_id]) {
                groups[user_id] = { 
                    user_id: user_id, 
                    employee_id: employee_id, 
                    total_hours_worked: 0,
                     id: index ,
                    earnings:0,
                    current_role_name:current_role_name
                };
                index++;
            }
            groups[user_id].total_hours_worked += hours_worked;
            groups[user_id].earnings += (hours_worked*pay_scale);
            

            return groups;
        }, {});

        // Convert grouped data object to an array of objects

        console.log("##groupedData", groupedData)
        const result = Object.values(groupedData);
        console.log("##result", result);
        setEmpData(result);
    }

    let fetchPersonDetails = async () => {

        let response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/getEmployeeDetails');
        let responseJson = await response.json();
        console.log("##person response", responseJson);

    }


    useEffect(() => {
        fetchAttendanceDetails();

        fetchPersonDetails();
    }, [])

    return (
        <div className={admstyles.body}>
            <div className={admstyles.title}>ADMIN PAGE</div>
            { showAdminPage &&
                <div className={admstyles.tableContainer}>
                <DataGrid

                    autoHeight
                    columns={columnHeaders}
                    rows={empData}

                >

                </DataGrid>
            </div>
            }

            {
                showPersonPage &&
                <div>
                    <OfPerson  attendanceData={AttendanceData} data={editRowData} close={backtoAdminpage}/> 

                </div>

           }

           {
            showEditScreen &&
            <div>
                <EditDetailsOfPerson  data={editRowData} close={backtoAdminpage}/>
                </div>
           }
            
            {
            showLeavesApprovalPage &&
            <div>
              <LeavesApproval data={editRowData} close={backtoAdminpage} > </LeavesApproval>
                </div>
            }

        </div>
    )
}