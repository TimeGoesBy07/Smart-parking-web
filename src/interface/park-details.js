import React, { useState, useEffect, useRef } from 'react'
import '../index'
import { useNavigate, useParams } from "react-router"
import { Button, CircularProgress, Stack } from '@mui/material'
import { ref, getDatabase, onChildChanged, onChildAdded, onChildRemoved } from "firebase/database"
import axios from 'axios'
import { TableContainer, TablePagination, TableCell, Table, TableBody, TableHead, TableRow, Typography } from "@mui/material"
import Paper from '@mui/material/Paper'
import { Chart as ChartJS, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import DeleteIcon from '@mui/icons-material/Delete'
import HVTMap from './-NlPFapga5nR38-bU4N7'
import BKMap from './-NlSHotmSczuAy6vWbYX'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement)

function TempComponent(props) {
    const { carList } = props

    switch (carList.key) {
        case '-NlPFapga5nR38-bU4N7':
            return <HVTMap status={carList.status} />

        case '-NlSHotmSczuAy6vWbYX':
            return <BKMap status={carList.status} />

        default:
            return <div>To be added</div>
    }
}

function CarParkArchitecture() {
    const getParkingLotAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getParkingLot'
    const carCountAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getCarCount'
    const updateCarCountAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateCarCount'
    const vehicleStatusAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateVehicleStatus'
    const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/findUserByEmail'
    const slotUpdateAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/postParkingLotStatus'
    const [areaStatus, setareaStatus] = useState([])
    const [page, pagechange] = useState(0)
    const [rowperpage, rowperpagechange] = useState(5)
    const [loading, setLoading] = useState(false)
    const { id, key } = useParams()
    const navigate = useNavigate()
    const db = getDatabase()
    const commentsRef = ref(db, `parking lot/${id}/${key}`)
    const chartRef = useRef()
    const [reload, setReload] = useState(false)
    const [empty, setEmpty] = useState(0)
    const [occupied, setOccupied] = useState(0)
    const [timeLine, setTimeLine] = useState([])
    const [requestUpdate, setRequestUpdate] = useState(false)
    const [carCount, setCarCount] = useState([])
    const [carList, setCarList] = useState()

    onChildChanged(commentsRef, () => setReload(!reload))

    const data = {
        labels: [`Occupied slots percentage: ${(occupied / (occupied + empty)).toFixed(2) * 100}%`, `Empty slots percentage: ${(empty / (occupied + empty)).toFixed(2) * 100}%`],
        datasets: [{
            label: 'Parking lot usage percentage',
            data: [occupied, empty],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            hoverOffset: 4
        }]
    }

    const dataVehicles = {
        labels: timeLine,
        datasets: [{
            label: 'Number of vehicles using service',
            data: carCount,
            borderColor: '#8291AD',
            backgroundColor: 'white',
            tension: 0.4
        }],
    }

    const columns = [
        { id: 'slot', name: 'Slot' },
        { id: 'status', name: 'Status' },
        { id: 'action', name: 'Action' },
    ]

    const handlechangepage = (event, newpage) => pagechange(newpage)

    const handleRowsPerPage = (event) => {
        rowperpagechange(+event.target.value)
        pagechange(0)
    }

    const calculatePercentage = array => {
        console.log(array)
        setEmpty(array.filter((element) => Object.values(element[1])[0] === 'empty').length)
        setOccupied(array.filter((element) => Object.values(element[1])[0] !== 'empty').length)
    }

    const getCarParkDetails = async () => {
        setLoading(true)

        axios.get(getParkingLotAPI, { params: { id: id, key: key } }).then(response => {
            axios.get(carCountAPI, { params: { uid: id, key: key } }).then(res => {
                let temp1 = []
                let temp2 = []

                Object.entries(res.data).forEach(element => {
                    temp1.push(element[0])
                    temp2.push(element[1])
                })

                setTimeLine(temp1)
                setCarCount(temp2)
                setCarList(response.data)
                setareaStatus(Object.entries(response.data.status))
                calculatePercentage(Object.entries(response.data.status))
                setLoading(false)
            }).catch((err) => console.log(err))
        }).catch((err) => console.log(err))
    }

    const handleUpdateData = async () => {
        if (timeLine.length === 5)
            setTimeLine(timeLine => timeLine.slice(1))

        let date = new Date()
        setTimeLine(timeLine => [...timeLine, date.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })])

        if (carCount.length === 5)
            setCarCount(carCount => carCount.slice(1))

        let temp = areaStatus.filter(element => Object.values(element[1])[0] !== 'empty')
        setCarCount(carCount => [...carCount, temp.length])
        setRequestUpdate(true)
    }

    const handleClear = (string) => {
        setLoading(true)
        const email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        var mySubString = string.substring(string.indexOf(".com ") + 5)

        axios.get(getUserAPI, { params: { email: string.match(email)[0] } }).then(res => {
            let temp = Object.values(Object.values(res.data)[0].vehiclelist).filter(element => element.registrationPlate === mySubString)

            axios.post(vehicleStatusAPI, {
                uid: Object.values(res.data)[0].id,
                key: Object.values(res.data)[0].key,
                isBooking: false,
                bookStart: '',
                bookLocation: '',
                vehicle: temp[0].key,
                qrCheck: false,
                slot: ''
            }).then(() => {
                axios.post(slotUpdateAPI, {
                    key: key,
                    id: id,
                    slot: temp[0].slot,
                    status: 'empty'
                }).then(() => {
                    setLoading(false)
                })
            })
        })
    }

    useEffect(() => {
        if (requestUpdate === true) {
            let newArray = timeLine.map((item, index) => [item, carCount[index]])
            axios.post(updateCarCountAPI, {
                array: Object.fromEntries(newArray),
                uid: id,
                key: key
            }).then(() => setRequestUpdate(false))
        }
        // eslint-disable-next-line
    }, [requestUpdate])

    useEffect(() => {
        setReload(false)
        // eslint-disable-next-line
    }, [reload])

    onChildRemoved(commentsRef, () => {
        if (reload === false) {
            getCarParkDetails()
            setReload(true)
        }
    })

    onChildChanged(commentsRef, () => {
        if (reload === false) {
            getCarParkDetails()
            setReload(true)
        }
    })

    onChildAdded(commentsRef, () => {
        if (reload === false) {
            getCarParkDetails()
            setReload(true)
        }
    })

    return (
        <div>
            <div style={{ margin: 50 }}>
                <Typography gutterBottom variant="h5" component="div">
                    Usage chart
                </Typography>
                <Stack direction="row" spacing={2} sx={{ width: '60%', margin: '20px' }}>
                    <Line data={dataVehicles} options={{}} ref={chartRef} />
                    <div><Doughnut data={data} options={{ maintainAspectRatio: false }} /></div>
                </Stack>
                {carList && <TempComponent carList={carList} />}
                <Paper sx={{ width: '100%', margin: 'auto' }}>
                    <TableContainer sx={{ maxHeight: 450 }} component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell align="left" style={{ backgroundColor: 'black', color: 'white' }} key={column.id}>{column.name}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ?
                                    <TableRow>
                                        <TableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                    :
                                    areaStatus
                                        .slice(page * rowperpage, page * rowperpage + rowperpage)
                                        .map((element) => {

                                            return (
                                                <TableRow key={element[0]}>
                                                    <TableCell>{Object.keys(element[1])[0]}</TableCell>
                                                    <TableCell>{Object.values(element[1])[0]}</TableCell>
                                                    {Object.values(element[1])[0].includes('occupied') ? <TableCell><DeleteIcon onClick={() => handleClear(Object.values(element[1])[0])} /></TableCell> : <TableCell></TableCell>}
                                                </TableRow>
                                            )
                                        })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        rowsPerPage={rowperpage}
                        page={page}
                        count={areaStatus.length}
                        component="div"
                        onPageChange={handlechangepage}
                        onRowsPerPageChange={handleRowsPerPage}
                    />
                </Paper>
            </div>
            <Button variant="text" onClick={() => handleUpdateData()} >Update data</Button>
            <Button variant="text" onClick={() => navigate('/parkinglist')} >Back</Button>
        </div>
    )
}

export default CarParkArchitecture