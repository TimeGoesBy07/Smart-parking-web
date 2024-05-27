import { v4 } from 'uuid'
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import '../index.css'
import { CircularProgress, Card, CardActions, CardContent, TextField, Box, Stack } from "@mui/material"
import axios from "axios"
import { Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

function AddParkingLot() {
    const createParkingLotAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/createParkingLot'
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const id = v4()

    // let str = "occupied by user1234";
    // let parts = str.split(" by "); // This will split the string into two parts: "occupied" and "user1234"

    // let part1 = parts[0]; // "occupied"
    // let part2 = parts[1]; // "user1234"

    // console.log(part2);

    const handleClose = () => setOpen(false)

    const handleClickOpen = () => setOpen(true)

    const handleAdding = (data) => {
        setLoading(true)
        const tempArr = Array.from({length: data.noSlot}, (_, i) => ({[`slot-${i+1}`]: 'empty'}))

        axios.post(createParkingLotAPI, {
            id: id,
            name: data.name,
            location: data.location,
            price: data.price,
            description: data.description,
            geo: [data.lng, data.lat],
            status: tempArr
        }).then(() => {
            setLoading(false)
            navigate('/parkinglist')
        })
    }

    return (
        <div className='userInfoAccess'>
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box> :
                <>
                    <Card sx={{ maxWidth: 700 }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Add a new parking lot
                            </Typography>

                            <TextField
                                disabled
                                sx={{ width: '90%', m: 2 }}
                                id="standard-basic"
                                label="ID"
                                variant="standard"
                                defaultValue={id} />

                            <TextField
                                sx={{ width: '90%', m: 2 }}
                                id="standard-basic"
                                label="Name"
                                variant="standard"
                                {...register('name', {
                                    required: { value: true, message: 'Name is required' },
                                    minLength: { value: 4, message: 'Type more! Why are u so sussy ? 😠' }
                                })} />
                            {errors.name && <p style={{ margin: '20px', color: 'red' }}>{errors.name.message}</p>}

                            <TextField
                                sx={{ width: '90%', m: 2 }}
                                id="standard-basic"
                                label="Location"
                                variant="standard"
                                {...register('location', {
                                    required: { value: true, message: 'Location is required' },
                                    minLength: { value: 6, message: 'Need at last 6 characters! Too lazy to type or what ? 😡' }
                                })} />
                            {errors.location && <p style={{ margin: '20px', color: 'red' }}>{errors.location.message}</p>}

                            <Stack sx={{ width: '90%', m: 2 }} direction="row" spacing={2}>
                                <TextField
                                    sx={{ width: '90%' }}
                                    id="standard-basic"
                                    label="Longitude"
                                    variant="standard"
                                    {...register('lng', {
                                        required: { value: true, message: 'Longitude is required' }                                    })} />
                                {errors.lng && <p style={{ margin: '20px', color: 'red' }}>{errors.lng.message}</p>}

                                <TextField
                                    sx={{ width: '90%' }}
                                    id="standard-basic"
                                    label="Latitude"
                                    variant="standard"
                                    {...register('lat', {
                                        required: { value: true, message: 'Latitude is required' }                                    })} />
                                {errors.lat && <p style={{ margin: '20px', color: 'red' }}>{errors.lat.message}</p>}
                            </Stack>

                            <TextField
                                sx={{ width: '90%', m: 2 }}
                                id="standard-basic"
                                label="Number of slots"
                                variant="standard"
                                {...register('noSlot', {
                                    required: { value: true, message: 'Number of slots is required' }
                                })} />

                            <TextField
                                sx={{ width: '90%', m: 2 }}
                                id="standard-basic"
                                label="Price"
                                variant="standard"
                                {...register('price', {
                                    required: { value: true, message: 'Price is required' },
                                    minLength: { value: 5, message: 'Price has to be more than 10000VND' }
                                })} />
                            {errors.price && <p style={{ margin: '20px', color: 'red' }}>{errors.price.message}</p>}

                            <TextField
                                sx={{ width: '90%', m: 2 }}
                                id="standard-basic"
                                label="Description"
                                variant="standard"
                                {...register('description', {
                                    required: { value: true, message: 'Description is required' },
                                    minLength: { value: 6, message: 'Need at last 6 characters! Too lazy to type or what ? 😡' }
                                })} />
                            {errors.description && <p style={{ margin: '20px', color: 'red' }}>{errors.description.message}</p>}
                        </CardContent>
                        <CardActions>
                            <Button variant="text" onClick={handleClickOpen} >Submit</Button>
                            <Button variant="text" onClick={() => navigate('/parkinglist')} >Back</Button>
                        </CardActions>
                    </Card>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Wait!"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Do you want to add this parking lot ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSubmit(handleAdding)} autoFocus>Yeah!</Button>
                            <Button onClick={handleClose} autoFocus>Never mind!</Button>
                        </DialogActions>
                    </Dialog>
                </>}
        </div>
    )
}

export default AddParkingLot