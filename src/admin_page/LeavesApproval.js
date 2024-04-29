
import { useEffect, useState } from 'react';
import admstyles from './css-folder/AdminPage.module.css'
import { Alert } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

import './css-folder/adminPagecss.css';

const LeavesApproval = (params) => {

    let [showalert, setShowAlert] = useState(false);
    let [showalertApprove, setShowAlertApprove] = useState(false);
    let [showalertReject, setShowAlertReject] = useState(false);

    let { close, data } = params;
    let [empObj, setEmpObj] = useState({
        employeeId: '',
        userId: '',
        payscale: '',
        newpayscale: '',
        currentRoleName: ''
    })

    let [empDataToShow, setEmpDataToShow] = useState([]);

    const columnHeaders = [
        { field: 'id', headerName: 'ID', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'start_date', headerName: 'Start Date', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'end_date', headerName: 'End Date', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'status', headerName: 'Status', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: "actionApprove", headerName: "Action", sortable: false, width: 150, fontSize: 12, fontWeight: 'bold',
            renderCell: (params) => {
                return (
<div className={`${admstyles.viewButton} ${params.row.status !== 'Pending' ? admstyles.disabled : ''}`}>
                        <a onClick={() => { approve_leaves(params.row, true) }} > approve</a>

                    </div>
                )
            }
        },
        {
            field: "actionReject", headerName: "Deny", sortable: false, width: 150, fontSize: 12, fontWeight: 'bold',
            renderCell: (params) => {
                return (
<div className={`${admstyles.viewButton} ${params.row.status !== 'Pending' ? admstyles.disabled : ''}`}>
                        <a onClick={() => { approve_leaves(params.row, false) }} > REJECT</a>

                    </div>
                )
            }
        },
    ];


    let [maxPayscale, setMaxPayscale] = useState(0);
    let approve_leaves = async (row, canApprove) => {
        console.log('row', row, '  ', canApprove);

        // https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/leaves/approve?id=1&approve=false

        const response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/leaves/approve?id=' + row.id + '&approve=' + canApprove, {
            method: 'POST'
        });

        const responseJson = await response.json();
        console.log('responseJson', responseJson);
        
    if(responseJson)
    {
        if(responseJson.status=='Rejected')
        {
            setShowAlertReject(true);
            setTimeout(() => {
                setShowAlertReject(false);
            }, 3000);
        
        }
        else if(responseJson.status=='Approved')
        {
            setShowAlertApprove(true);
            setTimeout(() => {
                setShowAlertApprove(false);
            }, 3000);
        }
        

        fetchLeavesHistory(data.employee_id);
    }
        

    }

    let fetchStadardPayrolls = async (current_role_name) => {

        let standardPayRollResponse = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/standardPayRolls');
        let standardPayRollResponseJson = await standardPayRollResponse.json();
        console.log('standardPayRollResponseJson', standardPayRollResponseJson);

        let maxPayscale = standardPayRollResponseJson.filter((e) => { return e.role_name == current_role_name })[0].standard_pay_scale;

        setMaxPayscale(maxPayscale);


    }

    let fetchLeavesHistory = async (empId) => {
        let response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/leaves/history?employeeId=' + data.employee_id);
        let responseJson = await response.json();
        console.log('responseJson history --> ', responseJson);
        if (responseJson) {
            if (responseJson.length > 0) {
                setEmpDataToShow(responseJson);
            }
        }
    }

    useEffect(() => {
        console.log('data------> ', data);
        setEmpDataToShow([]);



        fetchLeavesHistory(data.employee_id);
        fetchStadardPayrolls(data.current_role_name);



        setEmpObj((prev) => {
            let newObj = { ...prev };
            newObj.employeeId = data.employee_id;
            newObj.userId = data.user_id;
            newObj.currentRoleName = data.current_role_name;
            return newObj;
        })

        fetchPersonDetails(data.employee_id);
    }, [data])

    let fetchPersonDetails = async (employeeId) => {

        let response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/getEmployeeDetails');
        let responseJson = await response.json();
        console.log("##person response", responseJson);
        console.log(responseJson.filter((e) => { return e.id == employeeId })[0].payscale);
        // responseJson.filter((e)=>{return e.id==empObj.employeeId})[0].payscale
        setEmpObj((prev) => {
            let newObj = { ...prev };
            newObj.payscale = responseJson.filter((e) => { return e.id == employeeId })[0].payscale
            return newObj;
        })

    }


    let changeNewEmpObj = (e) => {

        let { value } = e.target;
        setEmpObj((prev) => {
            let newObj = { ...prev };
            newObj.newpayscale = value;
            return newObj;
        })
    }




    let saveEmployeeDetails = async () => {
        let payload = {
            newpayscale: empObj.newpayscale,
            employeeId: empObj.employeeId
        }

        if (empObj.newpayscale > maxPayscale) {
            console.log('Payroll cannot be greater than maximum payroll');
            setTimeout(() => {

                setShowAlert(false);

            }, 1000);

            setShowAlert(true);

            // return;

        }
        else {
            const response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/updatePersonPayRoll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log(response);
            close();
        }




        // close();

    }

    return (
        <div>
            <div className={admstyles.closeButton}>
                <button onClick={close}>Back</button>
            </div>
            <div style={admstyles.alertBox}>
                {
                    showalert && <Alert severity="error">Payroll cannot be greater than maximum payroll</Alert>
                }
                {
                    showalertApprove && <Alert severity="success">Approved Leaves</Alert>
                }
                {
                    showalertReject && <Alert severity="error">Rejected Leaves</Alert>
                }
            </div>




            <div className={admstyles.leave_approval_box_container}>

                <DataGrid

                    autoHeight
                    columns={columnHeaders}
                    rows={empDataToShow}
                    getRowId={(row) => row.id}

                >

                </DataGrid>
            </div>

            {/* <div className={admstyles.saveButton}>
                <button onClick={saveEmployeeDetails}>save</button>
            </div> */}



        </div>
    )

}


export default LeavesApproval;