import './css_folder/LoginPage.css'
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import empCredData from '../data_folders/employeeCredentials.json'
// import  adminCredData from '../data_folders/adminCredentials.json'
// import axios from 'axios';
export default function LoginPage() {
    let credentialsObject = {
        who: 'employee',
        password: '',
        userId: '',
        employeeId: ''

    }


    let [logInSuccess, setLogInSuccess] = useState(false);

    let [logInSuccessAsAdmin, setLogInSuccessAsAdmin] = useState(false);
    let [logInSuccessAsEmployee, setLogInSuccessAsEmployee] = useState(false);


    let [selectAsEmployee, setSelectAsEmployee] = useState(true);
    let [selectAsAdmin, setSelectAsAdmin] = useState(false);


    let [userId, setUserId] = useState('');
    let [password, setPassword] = useState('');
    let [logInAsData, setLogInAsData] = useState('');
    let [credentials, setCredentials] = useState(credentialsObject);


    //effect for the person type

    let [adminPersonClass, setAdminPersonClass] = useState('person');
    let [employeePersonClass, setemployeePersonClass] = useState('personActive');


    //effect for the username and password on the input
    let [focusAndValueExistClassUserId, setFocusAndValueExistClassUserId] = useState('label');
    let [focusAndValueExistClassPassword, setFocusAndValueExistClassPassword] = useState('label');

    let handleFocus = (id) => {
        if (id === "password") {
            setFocusAndValueExistClassPassword('label entering');
        }
        else if (id === "userId") {
            setFocusAndValueExistClassUserId('label entering');
        }

    }

    let handleBlur = () => {

        if (password.length === 0)
            setFocusAndValueExistClassPassword('label');

        if (userId.length === 0)
            setFocusAndValueExistClassUserId('label');

    }

    let handleChange = (value, id) => {


        if (id === "password") {
            setPassword(value);

            setCredentials({ ...credentials, password: value })
        }

        if (id === "userId") {
            setUserId(value);
            setCredentials({ ...credentials, userId: value })

        }


    }
    let selectAs = (event) => {
        let id = event.target.id;
        if (id === "admin") {
            setSelectAsAdmin(true);
            setSelectAsEmployee(false);
            setCredentials({ ...credentials, who: 'admin' })
            setAdminPersonClass('personActive');
            setemployeePersonClass('person');

            // document.documentElement.style.setProperty('--box-background','linear-gradient(45deg,#637da5,rgb(152, 172, 186))')
            document.documentElement.style.setProperty('--box-background', getComputedStyle(document.documentElement).getPropertyValue('--admin-box-background'))

        }

        if (id === "employee") {
            setSelectAsEmployee(true);
            setSelectAsAdmin(false);
            setCredentials({ ...credentials, who: 'employee' })

            setAdminPersonClass('person');
            setemployeePersonClass('personActive');

            document.documentElement.style.setProperty('--box-background', getComputedStyle(document.documentElement).getPropertyValue('--employee-box-background'))


        }



    }

    let checkCredentialsOfEmployee = () => {

        console.log("userid   ", userId, " password ", password)

        if (empCredData.find((e) => { return e.password == password && e.userId == userId })) {
            setLogInSuccessAsEmployee(true);
        }


    }


    // let logInAndFetchCookie=async()=>{


    //     console.log(credentials.who, '#', credentials.userId, '#', credentials.password);

    //     let response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(credentials)
    //     });

    //     let responseJson = await response.json();

    //     if(credentials.who=="employee" && responseJson['status']=="SUCCESS")
    //     setLogInSuccessAsEmployee(true);
    //     if(credentials.who=="admin" && responseJson['status']=="SUCCESS")    
    //     setLogInSuccessAsAdmin(true);


    //     console.log('response',responseJson );
    // }

    const logInAndFetchCookie = async () => {
        console.log(credentials.who, '#', credentials.userId, '#', credentials.password);
    
        try {
            const response = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include' // Include credentials (cookies)
            });
    
            // Assuming responseJson contains the login status
            const responseJson = await response.json();
            console.log('Received cookies:', document.cookie);
    
            // Set login success based on user type
            if (credentials.who === 'employee' && responseJson.status === 'SUCCESS') {
                console.log('employeeId:', responseJson.employeeId + ', payScale:', responseJson.payscale);

                setCredentials({ ...credentials, employeeId: responseJson.employeeId, payScale: responseJson.payscale, currentRole:responseJson.currentRole });
                setLogInSuccessAsEmployee(true);
            } else if (credentials.who === 'admin' && responseJson.status === 'SUCCESS') {
                // setDetails();
                setLogInSuccessAsAdmin(true);
            }
    
            console.log('Login successful');
        } catch (error) {
            // Handle fetch error
            console.error('Error logging in:', error);
        }
    };


    // let setDetails = async () => {

    //     if (credentials.who == "employee") {
    //         let employeeCredData = [];


    //         if (employeeCredData.length == 0) {
    //             let employeeCredresponse = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/getEmployeeDetails');
    //             let employeeCredresponseJson = await employeeCredresponse.json();
    //             employeeCredresponseJson.map((e) => {
    //                 employeeCredData.push(e);
    //             })
    //         }



    //         console.log("### employeeCredData of admin", employeeCredData);
    //         console.log(credentials.who, '#', credentials.userId, '#', credentials.password);


    //         if (employeeCredData.length > 0)
    //             if (employeeCredData.find((e, index) => { return e.userid == credentials.userId && e.password == credentials.password })) {


    //                 setCredentials({ ...credentials, 
    //                     employeeId: employeeCredData.find((e, index) => { return e.userid == credentials.userId && e.password == credentials.password }).id,
    //                      payScale: employeeCredData.find((e, index) => { return e.userid == credentials.userId && e.password == credentials.password }).payscale });

    //                 // console.log('Employee login success')
    //                 // setLogInSuccessAsEmployee(true);
    //             }





    //     }
    //     if (credentials.who == "admin") {

    //         let adminCredData = [];


    //         if (adminCredData.length == 0) {
    //             let adminCredresponse = await fetch('https://backend-azure-spring-ttp-azure-ser.azuremicroservices.io/ttp-application/getStandardPayrolls');
    //             let adminCredresponseJson = await adminCredresponse.json();
    //             adminCredresponseJson.map((e) => {
    //                 adminCredData.push(e);
    //             })
    //         }



    //         console.log("### adminCredData of admin", adminCredData);
    //         console.log(credentials.who, '#', credentials.userId, '#', credentials.password);


    //         if (adminCredData.length > 0)
    //             if (adminCredData.find((e, index) => { console.log(index); return e.userid == credentials.userId && e.password == credentials.password })) {
    //                 // console.log('admin login success')
    //                 // setLogInSuccessAsAdmin(true);
    //             }




    //         //rechecking the dummy details
    //         // checkCredentialsOfAdmin();
    //     }
    // }



    //useEffects
    const rootStyles = getComputedStyle(document.documentElement);

    useEffect(() => {
        console.log('useeffect -->', credentials);
    }, [credentials])


    useEffect(() => {
        // const rootStyles = getComputedStyle(document.documentElement);
        // const color = rootStyles.getPropertyValue('--box-background');
        // console.log(color);

    }, [])


    if (logInSuccessAsAdmin) {
        return <Navigate to="/admin" />;
    }

    if (logInSuccessAsEmployee) {
        return <Navigate to="/employee" state={{ propData: credentials }} />;
    }
    return (

        <div className="body">
            <div className='background'>
            </div>


            <div className="container">


                <div className="who">

                    <div onClick={selectAs} className={employeePersonClass} id="employee">
                        <input type='radio' checked={selectAsEmployee} readOnly id="employee"></input>
                        EMPLOYEE
                    </div>


                    <div onClick={selectAs} className={adminPersonClass} id="admin">
                        <input type='radio' checked={selectAsAdmin} readOnly id="admin"></input>
                        ADMIN
                    </div>
                </div>

                <div className="information">

                    <div className={focusAndValueExistClassUserId}>USER ID</div>
                    <input onFocus={() => handleFocus('userId')} onBlur={handleBlur} onChange={(e) => handleChange(e.target.value, 'userId')} className="inputSpace"></input>


                </div>

                <div className="information">
                    <div className={focusAndValueExistClassPassword}>PASSWORD</div>
                    <input type='password' onFocus={() => handleFocus('password')} onBlur={handleBlur} onChange={(e) => handleChange(e.target.value, 'password')} className="inputSpace"></input>
                </div>

                {/* <div className="buttonSpace">
                    <div
                        onClick={logInAs} className="loginButton">
                        LOGIN
                    </div>
                </div> */}

                <div className="buttonSpace">
                    <div
                        onClick={logInAndFetchCookie} className="loginButton">
                        LOGIN
                    </div>
                </div>


            </div>
        </div>

    )

}