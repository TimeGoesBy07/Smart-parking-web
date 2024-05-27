import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { useState, useEffect } from "react"
import '../index.css'
import { CircularProgress, Card, CardActions, CardContent, TextField, Box } from "@mui/material"
import axios from "axios"
import { Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

function UserUpdate() {
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUser'
	const updateDataAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateData'
	const deleteUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/deleteUser'
	const { register, reset, handleSubmit, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [deletebtn, setBtn] = useState(false)
	const [user, setUser] = useState()
	const navigate = useNavigate()
	const handleClose = () => setOpen(false)
	const handleClickOpen = () => setOpen(true)
	const uid = useParams()?.uid

	const handleDeleteClickOpen = () => {
		setOpen(true)
		setBtn(true)
	}

	useEffect(() => {
		console.log(user)
		// eslint-disable-next-line
	}, [user])

	useEffect(() => {
		getUser()
		// eslint-disable-next-line
	}, [])

	const getUser = () => {
		setLoading(true)

		axios.get(getUserAPI, { params: { uid: uid } }).then((response) => {
			setUser(Object.values(response.data)[0])
			reset({
				"username": Object.values(response.data)[0].username,
				"phone": Object.values(response.data)[0].phone,
				"password": Object.values(response.data)[0].password,
			})
			setLoading(false)
		})
	}

	const handleUpdate = async (data, e) => {
		e.preventDefault()
		setLoading(true)

		await axios.post(updateDataAPI, {
			"uid": user.id,
			"key": user.key,
			"newUsername": data.newUsername,
			"newPhone": data.newPhone,
			"newPassword": data.newPassword
		})
			.then((response) => {
				setLoading(false)
				navigate('/list')
			})
	}

	const handleDelete = () => {
		setLoading(true)

		axios.delete(deleteUserAPI, { data: { "email": user.emailAddress } }).then(() => {
			setLoading(false)
			navigate('/list')
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
								Update a user
							</Typography>
							{user && <>
								<TextField
									disabled
									sx={{ width: 0.9, m: 2 }}
									id="standard-basic"
									label="Email"
									variant="standard"
									defaultValue={user.emailAddress}
								/>

								<TextField
									sx={{ width: 0.9, m: 2 }}
									id="standard-basic"
									label="Username"
									variant="standard"
									defaultValue={user.username}
									{...register('newUsername', {
										required: { value: true, message: 'Username is required' },
										minLength: { value: 4, message: 'Type more! Why are u so sussy ? 😠' }
									})} />
								{errors.newUsername && <p style={{ margin: '20px', color: 'red' }}>{errors.newUsername.message}</p>}

								<TextField
									sx={{ width: 0.9, m: 2 }}
									id="standard-basic"
									label="Phone"
									variant="standard"
									defaultValue={user.phone}
									{...register('newPhone', {
										required: { value: true, message: 'Phone is required' },
										pattern: { value: /^[0-9]*$/, message: 'Only numbers are allowed' }
									})} />
								{errors.newPhone && <p style={{ margin: '20px', color: 'red' }}>{errors.newPhone.message}</p>}

								<TextField
									disabled
									sx={{ width: 0.9, m: 2 }}
									id="standard-basic"
									label="Password"
									variant="standard"
									defaultValue={user.password}
									{...register('newPassword', {
										required: { value: true, message: 'Password is required' },
										minLength: { value: 6, message: 'Need at last 6 characters! Too lazy to type or what ? 😡' }
									})} />
								{errors.newPassword && <p style={{ margin: '20px', color: 'red' }}>{errors.newPassword.message}</p>}</>}
						</CardContent>
						<CardActions>
							<Button variant="text" onClick={handleClickOpen} >Submit</Button>
							<Button variant="text" onClick={handleDeleteClickOpen} >Delete this user</Button>
							<Button variant="text" onClick={() => navigate('/list')} >Back</Button>
						</CardActions>
					</Card>
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogTitle id="alert-dialog-title">
							{"Wait!"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								You are updating data of the current user or deleting them. Do you want to proceed ?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							{deletebtn === true ? <Button onClick={() => handleDelete()}>Yeah! Kill them!</Button> : <Button onClick={handleSubmit(handleUpdate)}>Yeah! Do it!</Button>}
							<Button onClick={handleClose} autoFocus>Never mind!</Button>
						</DialogActions>
					</Dialog>
				</>
			}
		</div>
	)
}

export default UserUpdate