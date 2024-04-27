import empStyles from './css_folder/employeePage.module.css'
import { useState, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

let OfEmployee = (params) => {

    let { close, propData } = params;

    let [personName, setPersonName] = useState('');

    let [dbData, setDbData] = useState([]);

    let [analyticsData, setAnalyticsData] = useState([]);

    let [filterOption, setFilterOption] = useState('Daily');
    let [perDayData, setPerDayData] = useState([]);



    useEffect(() => {


        console.log('propData', propData);


        fetchData(propData);

        setPersonName(propData.userId)

    }, [propData]);

    useEffect(() => {


        console.log('dbData ', dbData);

    }, [dbData]);

    const fetchData = async (propData) => {

        console.log("##fetchData in the ofEmployee page##", propData.userId)

        let payload = {
            userId: propData.userId
        }
        const response = await fetch('http://localhost:8081/ttp-application/EmployeeDetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const dataJson = await response.json();

        console.log("data fetched from the employee table", JSON.stringify(dataJson));


        let dbData = dataJson.map((e, index) => {
            return {
                ...e,
                in_time: e.in_time && e.in_time != null ? e.in_time.split('T')[0].substring(0, 10) : null,
                out_time: e.out_time && e.out_time != null ? e.out_time.split('T')[0].substring(0, 10) : null,
                actId: index + 1
            }
        });


        setDbData(dbData);
        // setAnalyticsData(dbData)
                setDataInBarGraph(); 



    };

    let handleChange = (event) => {
        console.log(event.target.value);
        setFilterOption(event.target.value);

    }

    let setDataInBarGraph=()=>{

        if (filterOption == 'Daily') {
            let dataToShow = [...dbData];
        
            let groupedDataObject = dataToShow.reduce((acc, e) => {
        
                let day = e['in_time'];
        
                if (!acc[day]) {
                    acc[day] = {
                        in_time: day,
                        earnings: e['hours_worked'] * e['pay_scale'],
                        deductions: (e['hours_worked'] * e['pay_scale']) * 0.1 // 10% deductions
                    }
                } else {
                    acc[day].earnings += e['hours_worked'] * e['pay_scale'];
                    acc[day].deductions += (e['hours_worked'] * e['pay_scale']) * 0.1; // Adding deductions
                }
                return acc;
            }, {})
            console.log(groupedDataObject);
        
            setAnalyticsData(Object.values(groupedDataObject));
        
            setPerDayData(Object.values(groupedDataObject))
        }
        
        if (filterOption == 'Monthly') {
            let dataToShow = [...dbData];
        
            let groupedDataObject = perDayData.reduce((acc, e) => {
        
                let date = e['in_time'].substring(0, 7);
        
                if (!acc[date]) {
                    acc[date] = {
                        in_time: date,
                        earnings: e['earnings'],
                        deductions: e['deductions'] // Copy deductions from perDayData
                    }
                } else {
                    acc[date].earnings += e['earnings'];
                    acc[date].deductions += e['deductions']; // Add deductions
                }
                return acc;
            }, {})
            console.log(groupedDataObject);
        
            setAnalyticsData(Object.values(groupedDataObject));
        }
        

        if (filterOption === 'Weekly') {
            let dataToShow = [...dbData];
        
            let groupedDataObject = perDayData.reduce((acc, e) => {
                let yearMonth = e.in_time.substring(0, 7);
                let day = parseInt(e.in_time.substring(8, 10)); 
        
                let weekNumber = Math.ceil(day / 7);
        
                let weekLabel = `${yearMonth}-week${weekNumber}`;
        
                if (!acc[weekLabel]) {
                    acc[weekLabel] = {
                        in_time: weekLabel,
                        earnings: e.earnings,
                        deductions: e.deductions // Assuming 'deductions' is already calculated for each entry in perDayData
                    };
                } else {
                    acc[weekLabel].earnings += e.earnings;
                    acc[weekLabel].deductions += e.deductions; // Add deductions
                }
                return acc;
            }, {});
        
            let sortedAnalyticsData = Object.values(groupedDataObject).sort((a, b) => {
                let weekA = parseInt(a.in_time.match(/\d+$/)[0]);
                let weekB = parseInt(b.in_time.match(/\d+$/)[0]);
        
                return weekA - weekB; 
            });
        
            console.log(sortedAnalyticsData);
        
            setAnalyticsData(sortedAnalyticsData);
        }
        

       
        

    }


    useEffect(() => {

        setDataInBarGraph(); 


    }, [filterOption,dbData])

    return (
        <div>
            <div className={empStyles.statsBody}>




                <div className={empStyles.closeButton}>
                    <button onClick={close}>Back</button>
                </div>

                <div className={empStyles.filterSpace}>
                    <Box sx={{ minWidth: 10 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Choose Filter</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterOption}
                                label="Choose Filter"
                                onChange={handleChange}
                            >
                                {/* <MenuItem value={'Last3weeks'}>Last 3 weeks</MenuItem>
                                <MenuItem value={'Last3Months'}>Last 3 Months</MenuItem> */}
                                <MenuItem value={'Weekly'}>Weekly</MenuItem>
                                <MenuItem value={'Monthly'}>Monthly</MenuItem>
                                <MenuItem value={'Daily'}>Daily</MenuItem>


                            </Select>
                        </FormControl>
                    </Box>
                </div>



                {/* <h1> welcome {personName}</h1> */}

                {analyticsData.length > 0 ? (


                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={300}
                            height={300}
                            data={analyticsData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="in_time" />
                            <YAxis label={{ value: 'Earnings', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="earnings" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />}/>
                            <Bar dataKey="deductions" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />

                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div>Loading...</div>
                )}

            </div>
        </div>
    )

}


export default OfEmployee;