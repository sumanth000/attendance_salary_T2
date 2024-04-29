
import { useEffect, useState } from 'react';
import admstyles from './css-folder/AdminPage.module.css'
import { Alert } from '@mui/material';




const EditDetailsOfPerson = (params) => {

    let [showalert, setShowAlert] = useState(false);

    let { close, data } = params;
    let [empObj, setEmpObj] = useState({
        employeeId: '',
        userId: '',
        payscale: '',
        newpayscale: '',
        currentRoleName:''
    })


    let [maxPayscale, setMaxPayscale] = useState(0);

      let fetchStadardPayrolls = async (current_role_name) => {

        let standardPayRollResponse = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/standardPayRolls');
        let standardPayRollResponseJson = await standardPayRollResponse.json();
        console.log('standardPayRollResponseJson', standardPayRollResponseJson);

        let maxPayscale = standardPayRollResponseJson.filter((e) => { return e.role_name == current_role_name })[0].standard_pay_scale;

        setMaxPayscale(maxPayscale);
          

      }

    useEffect(() => {
        console.log('data', data);


        fetchStadardPayrolls(data.current_role_name);



        setEmpObj((prev) => {
            let newObj = { ...prev };
            newObj.employeeId = data.employee_id;
            newObj.userId = data.user_id;
            newObj.currentRoleName=data.current_role_name;
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




     let saveEmployeeDetails =async()=>{
        let payload = {
            newpayscale: empObj.newpayscale,
            employeeId: empObj.employeeId
        }

        if(empObj.newpayscale>maxPayscale)
            {
                console.log('Payroll cannot be greater than maximum payroll');
                setTimeout(() => {

                    setShowAlert(false);
                    
                }, 1000);

                setShowAlert(true);

                // return;

            }
            else
            {
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
            </div>

            


            <div className={admstyles.box_container}>
                <div className={admstyles.boxy}>
                    <label>EMPLOYEE ID:</label>
                    <span>{empObj.employeeId}</span>
                </div>
                <div className={admstyles.boxy}>
                    <label>USER ID:</label>
                    <span>{empObj.userId}</span>
                </div>
                <div className={admstyles.boxy}>
                    <label>CURRENT PAYROLL:</label>
                    <span>
                        {empObj.payscale}
                    </span>
                </div>
                <div className={admstyles.boxy}>
                    <label>CURRENT ROLE NAME:</label>
                    <span>
                        {empObj.currentRoleName}
                    </span>
                </div>
                <div className={admstyles.boxy}>
                    <label>MAXIMUM PAY ROLL:</label>
                    <span>
                        {maxPayscale}
                    </span>
                </div>

                <div className={admstyles.boxy}>
                    <label>EDIT PAYROLL:</label>
                    <span>
                        Enter PayScale
                        <input className={admstyles.boxyInput} onChange={(e) => changeNewEmpObj(e)} defaultValue={empObj.payscale} id='payroll'></input>
                    </span>
                </div>

            </div>

            <div className={admstyles.saveButton}>
                <button onClick={saveEmployeeDetails}>save</button>
            </div>

            

        </div>
    )

}


export default EditDetailsOfPerson;