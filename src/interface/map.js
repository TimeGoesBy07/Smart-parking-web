import React, { useEffect, useState } from 'react'
import '../index'
import { Button, Stack, Box, Divider, CircularProgress, Dialog } from '@mui/material'
import { MapContainer, TileLayer, Popup, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet'
import { popupContent, popupHead, popupText } from "./popup-style.js"
import OnBuildRoute from './route.js'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LocalParkingIcon from '@mui/icons-material/LocalParking'
import axios from 'axios'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RadarIcon from '@mui/icons-material/Radar'
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import GarageIcon from '@mui/icons-material/Garage'
import { getDatabase, ref, onChildChanged } from "firebase/database"
import { useNavigate } from "react-router"

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})

const PIcon = L.icon({
    iconUrl: '../car-marker.png',
    iconSize: [40, 40],
    shadowUrl: iconShadow,
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})

const ZOOM_LEVEL = 16;

function OnMapView({ pos: props }) {
    const map = useMap()
    useEffect(() => {
        props && map.flyTo(props, ZOOM_LEVEL, { animate: true })
        // eslint-disable-next-line
    }, [props])
    return null
}

function GgMap() {
    const displayParkingLotAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/displayParkingList'
    const [currentLocation, setCurrentLocation] = useState({ pos: [10.7725168, 106.6980208] })
    const [findRoute, setFindRoute] = useState()
    const [destination, setDestination] = useState()
    const [openHelp, setOpenHelp] = useState(false)
    const [destLot, setdestLot] = useState()
    const [loading, setLoading] = useState(true)
    const [placesList, setPLacesList] = useState()
    const user = JSON.parse(localStorage.getItem('user'))
    const db = getDatabase();
    const timeRef = ref(db, 'users/' + user.id + user.key + 'time')
    const navigate = useNavigate()

    onChildChanged(timeRef, snapshot => console.log(snapshot.val()))

    const goToThisPlace = geo => {
        setFindRoute('yes')
        setDestination(geo)
    }

    const onClearingRoute = () => { setFindRoute('no') }

    // const findNearestParkingLot = () => {
    //     setFindRoute('yes')
    //     let minRoute = getDistance({ latitude: currentLocation.pos.lat, longitude: currentLocation.pos.lng }, { latitude: Object.values(placesList[0])[0].geo[0], longitude: Object.values(placesList[0])[0].geo[1] })
    //     let tempGeo = Object.values(placesList[0])[0].geo

    //     placesList.forEach(element => {
    //         let temp = Object.keys(element)[0]
    //         let calDis = getDistance({ latitude: currentLocation.pos.lat, longitude: currentLocation.pos.lng }, { latitude: element[temp].geo[0], longitude: element[temp].geo[1] })

    //         if (calDis < minRoute)
    //             tempGeo = element[temp].geo

    //     })

    //     setDestination(tempGeo)
    // }

    const getCurrentLocation = () => {
        navigator?.geolocation.getCurrentPosition(position => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            setCurrentLocation({ ...currentLocation, pos: pos });
        })
    }

    const bookSlot = val => {
        navigate(`/parkinglist/${val.id}/${val.key}`)
    }

    useEffect(() => {
        getCurrentLocation()

        axios.get(displayParkingLotAPI).then(response => {
            setPLacesList(Object.values(response.data))
            // const strData = Object.values(response.data[0])[0].status
            // setAreaStatus(Array.from(JSON.parse(strData)))
            setLoading(false)
        }).catch((error) => console.log(error))
        // eslint-disable-next-line
    }, [])

    return (
        <div style={{ display: 'inline-block', height: '80vh', width: '100%' }} >
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box> :
                <div>
                    <MapContainer
                        center={currentLocation.pos}
                        zoom={ZOOM_LEVEL}
                        style={{ height: '80vh', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {currentLocation && <Marker
                            icon={DefaultIcon}
                            position={currentLocation.pos}
                        >
                            <Popup>You are here</Popup>
                        </Marker>}
                        {placesList.map(val => {
                            let temp = Object.keys(val)[0]

                            return <Marker
                                key={val[temp].key}
                                icon={PIcon}
                                position={val[temp].geo}
                            >
                                <Popup key={val[temp].key} className="request-popup">
                                    <div style={popupContent}>
                                        <div className="m-2" style={popupHead}>
                                            <GarageIcon style={{ height: '40px', width: '40px', marginRight: '10px' }} />{val[temp].name}
                                        </div>
                                        <span style={popupText}>
                                            Price: {val[temp].price}VND/Hour <br />
                                            Description: {val[temp].description}<br />
                                        </span>
                                        <Stack
                                            direction='row'
                                            sx={{ m: 3 }}
                                            divider={<Divider orientation="vertical" flexItem />}
                                            spacing={1}>
                                            <Button onClick={() => bookSlot(val[temp])} autoFocus>View details</Button>
                                            <Button onClick={() => goToThisPlace(val[temp].geo)} autoFocus>Show route</Button>
                                        </Stack>
                                    </div>
                                </Popup>
                            </Marker>
                        })}
                        <OnMapView pos={currentLocation.pos} />
                        <OnBuildRoute pos={currentLocation.pos} des={destination} signal={findRoute} />
                        <Stack direction="column" justifyContent="center" alignItems="left" marginTop="80px">
                            <LocationOnIcon onClick={() => getCurrentLocation()} sx={{ zIndex: 1300, margin: '10px' }} /> 
                            <HighlightOffIcon onClick={() => onClearingRoute()} sx={{ zIndex: 1300, margin: '10px' }} />
                            <HelpCenterIcon onClick={() => setOpenHelp(true)} sx={{ zIndex: 1300, margin: '10px' }} />
                        </Stack>
                    </MapContainer>
                    {/* {payment === false ? <ParkingList /> : (
                        <div style={{
                            margin: '30px',
                            fontFamily: '"Lucida Console", "Courier New", monospace'
                        }}>
                            <Card sx={{ width: '100%', marginTop: 3 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {destLot.name} car park status
                                    </Typography>
                                    <CarParkArchitecture />
                                    <Paper sx={{ width: '100%' }}>
                                        <TableContainer sx={{ maxHeight: 450 }} component={Paper}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ width: '20%' }} >
                                                            Name
                                                        </TableCell>
                                                        <TableCell sx={{ width: '20%' }} >
                                                            Status
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(loading ?
                                                        <TableRow>
                                                            <TableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <CircularProgress />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        parkingLotAreas
                                                            .slice(page * rowperpage, page * rowperpage + rowperpage)
                                                            .map(row => {

                                                                return (
                                                                    <TableRow key={row.Slot}>
                                                                        <TableCell sx={{ width: '20%' }} >
                                                                            {row.Slot}
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '20%' }} >
                                                                            {row.status}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            }))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            rowsPerPage={rowperpage}
                                            page={page}
                                            count={parkingLotAreas.length}
                                            component="div"
                                            onPageChange={handlechangepage}
                                            onRowsPerPageChange={handleRowsPerPage}
                                        >
                                        </TablePagination>
                                    </Paper>
                                </CardContent>
                            </Card>
                            <Card sx={{ width: '100%', marginTop: 3 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Payment
                                    </Typography>
                                    <MakePayment lot={destLot} />
                                    <CardActions>
                                        <Button onClick={() => setPayment(false)}>Cancel</Button>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        </div>
                    )} */}
                    <Dialog
                        open={openHelp}
                        onClose={() => setOpenHelp(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Usage"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                How to use the map! <br />
                                <LocationOnIcon /> Get your current location <br />
                                <RadarIcon /> Show route to the nearest parking lot <br />
                                <LocalParkingIcon /> Mark all parking lots on the map <br />
                                <HighlightOffIcon /> Clear the route <br />
                                You can check the usage again using the <HelpCenterIcon /> icon !
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenHelp(false)} autoFocus>OK</Button>
                        </DialogActions>
                    </Dialog>
                </div>}
        </div>
    )
}

export default GgMap
