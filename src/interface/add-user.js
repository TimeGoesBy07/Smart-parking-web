import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { auth } from "../firebase/firebase"
import '../index.css'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { CircularProgress, Card, CardActions, CardContent, TextField, Box } from "@mui/material"
import axios from "axios"
import { Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

function UsersForm() {
	const createUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/createUser'
	const { register, handleSubmit, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const handleClose = () => setOpen(false)
	const handleClickOpen = () => setOpen(true)

	const handleNewUser = (data, e) => {
		e.preventDefault()
		setLoading(true)

		createUserWithEmailAndPassword(auth, data.Email, data.Password).then(userCredential => {
			axios.post(createUserAPI, {
				"id": userCredential.user.uid,
				"username": data.Username,
				"emailAddress": data.Email,
				"phone": data.Phone,
				"password": data.Password,
				"money": 0
			}).then(() => {
				setLoading(false)
				navigate('/list')
			})
		}).catch((error) => {
				console.error(error)
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
								Add a user
							</Typography>

							<TextField
								sx={{ width: 0.9, m: 2 }}
								id="standard-basic"
								label="Username"
								variant="standard"
								{...register('Username', {
									required: { value: true, message: 'Username is required' },
									minLength: { value: 4, message: 'Type more! Why are u so sussy ? 😠' }
								})} />
							{errors.Username && <p style={{ margin: '20px', color: 'red' }}>{errors.Username.message}</p>}

							<TextField
								sx={{ width: 0.9, m: 2 }}
								id="standard-basic"
								label="Email"
								variant="standard"
								{...register('Email', {
									required: { value: true, message: 'Email is required' },
									pattern: { value: /.+@.+\.[A-Za-z]+$/, message: `That's not a valid email! 😞 ` }
								})} />
							{errors.Email && <p style={{ margin: '20px', color: 'red' }}>{errors.Email.message}</p>}

							<TextField
								sx={{ width: 0.9, m: 2 }}
								id="standard-basic"
								label="Phone"
								variant="standard"
								{...register('Phone', {
									required: { value: true, message: 'Phone is required' },
									pattern: { value: /^[0-9]*$/, message: 'Only numbers are allowed' }
								})} />
							{errors.GivePoints && <p style={{ margin: '20px', color: 'red' }}>{errors.GivePoints.message}</p>}

							<TextField
								sx={{ width: 0.9, m: 2 }}
								id="standard-basic"
								label="Password"
								variant="standard"
								{...register('Password', {
									required: { value: true, message: 'Password is required' },
									minLength: { value: 6, message: 'Need at last 6 characters! Too lazy to type or what ? 😡' }
								})} />
							{errors.Password && <p style={{ margin: '20px', color: 'red' }}>{errors.Password.message}</p>}
						</CardContent>
						<CardActions>
							<Button variant="text" onClick={handleClickOpen} >Submit</Button>
							<Button variant="text" onClick={() => navigate('/list')} >Back to user list</Button>
						</CardActions>
					</Card>
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{"Hold on!"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								Create this user ?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleSubmit(handleNewUser)}>Yeah! Add them!</Button>
							<Button onClick={handleClose} autoFocus>Never mind!</Button>
						</DialogActions>
					</Dialog>
				</>
			}
		</div>
	)
}

export default UsersForm