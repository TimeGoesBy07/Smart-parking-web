import '../index.css'
import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Button, CircularProgress, Stack, Typography, Box } from '@mui/material'
import axios from 'axios'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

function Graph() {
    const updateUserCount = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateUserCount'
    const getUserCountAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUserCount'
    const displayUsersListAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/displayUsersList'
    // const getCarCount = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getTotalCarCount'
    // const updateCarCount = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateTotalCarCount'
    const chartRef = useRef()
    const [usersList, setUsersList] = useState([])
    const [userCount, setUserCount] = useState([])
    const [loading, setLoading] = useState(true)
    // const [totalVehicles, setTotalVehicles] = useState([])
    const [timeLine, setTimeLine] = useState([])
    const [requestUpdate, setRequestUpdate] = useState(false)
    // const [sum, setSum] = useState()

    const getUserCount = () => {
        setLoading(true)

        axios.get(getUserCountAPI).then(response => {
            let temp1 = []
            let temp2 = []

            Object.entries(response.data).forEach(element => {
                temp1.push(element[0])
                temp2.push(element[1])
            })

            setTimeLine(temp1)
            setUserCount(temp2)
            setLoading(false)
        })
    }

    // const getTotalCarCount = () => {
    //     setLoading(true)

    //     axios.get(getCarCount).then(response => {
    //         let temp1 = []
    //         let temp2 = []

    //         Object.entries(response.data).forEach(element => {
    //             temp1.push(element[0])
    //             temp2.push(element[1])
    //         })

    //         console.log(temp1)
    //         setTimeLine(temp1)
    //         setTotalVehicles(temp2)
    //         setLoading(false)
    //     })
    // }

    const callListData = () => {
        setLoading(true)

        axios.get(displayUsersListAPI).then(response => {
            setUsersList(Object.values(response.data))
            // let sum = 0
            // Object.values(response.data).forEach(element => sum = sum + Object.keys(Object.values(element)[0].vehiclelist).length)
            // setSum(sum)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    // const dataVehicles = {
    //     labels: timeLine,
    //     datasets: [{
    //         label: 'Number of vehicles using service',
    //         data: totalVehicles,
    //         borderColor: '#8291AD',
    //         backgroundColor: 'white',
    //         tension: 0.4
    //     }],
    // }

    const dataUsers = {
        labels: timeLine,
        datasets: [{
            label: 'Number of users',
            data: userCount,
            borderColor: '#8291AD',
            backgroundColor: 'white',
            tension: 0.4
        }],
    }

    // useEffect(() => {
    //     console.log(sum)
    //     setTotalVehicles(totalVehicles => [...totalVehicles, sum])
    // }, [sum])

    const handleClick = async () => {
        callListData()

        if (timeLine.length === 5)
            setTimeLine(timeLine => timeLine.slice(1))

        let date = new Date()
        setTimeLine(timeLine => [...timeLine, date.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })])
        // setTotalVehicles(totalVehicles => [...totalVehicles, sum])

        // if (totalVehicles.length === 5)
        //     setTotalVehicles(totalVehicles => totalVehicles.slice(1))

        if (userCount.length === 5)
            setUserCount(userCount => userCount.slice(1))

        setUserCount(userCount => [...userCount, usersList.length])
        setRequestUpdate(true)
    }

    useEffect(() => {
        if (requestUpdate === true) {
            let newArray = timeLine.map((item, index) => [item, userCount[index]])
            // let newArrayTwo = timeLine.map((item, index) => [item, totalVehicles[index]])

            axios.post(updateUserCount, { array: Object.fromEntries(newArray) }).then(() => {
                // axios.post(updateCarCount, { array: Object.fromEntries(newArrayTwo) }).then(() => {
                    setRequestUpdate(false)
                // })
            })
        }
    }, [requestUpdate])


    useEffect(() => {
        callListData()
        getUserCount()
        // getTotalCarCount()
    }, [])

    return (
        <div className='homepage'>
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box> :
                <div>
                    <Stack
                        sx={{ m: 5 }}
                        spacing={2}
                        justifyContent="center"
                        alignItems="center">
                        {/* <div style={{ width: '80%' }}>
                            <Typography gutterBottom variant="h5" component="div">
                                Number of vehicles chart
                            </Typography>
                            <Line
                                data={dataVehicles}
                                options={{}}
                                ref={chartRef} />
                        </div> */}
                        <div style={{ width: '80%' }}>
                            <Typography gutterBottom variant="h5" component="div">
                                Number of users chart
                            </Typography>
                            <Line
                                data={dataUsers}
                                options={{}}
                                ref={chartRef} />
                        </div>
                    </Stack>
                    <Button onClick={() => handleClick()}>Click me</Button>
                </div>}
        </div >
    )
}

export default Graph