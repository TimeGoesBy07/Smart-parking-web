import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import '../index'
import { useState, useEffect } from "react"
import { CircularProgress, Card, CardActions, CardContent, TextField, Box, Typography } from "@mui/material"
import axios from "axios"
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch'
import Tooltip from '@mui/material/Tooltip'

function UserPage() {
	const getAdmin = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getAdmin'
	const updateDataAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateData'
	const { register, reset, handleSubmit, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(true)
	const [open, setOpen] = useState(false)
	const [openExcuseYou, setExcuseYou] = useState(false)
	const [data, setData] = useState()
	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem('user'))

	const getUser = () => {
		setLoading(true)

		axios.get(getAdmin, { params: { uid: user.id } }).then(res => {
			const firstKey = Object.keys(res.data)[0]
			setData(res.data[firstKey])

			reset({
			    "username": res.data[firstKey].username,
			    "phone": res.data[firstKey].phone,
			    "password": res.data[firstKey].password,
			})

			setLoading(false)
		})
	}

	const handleUpdate = (value, e) => {
		e.preventDefault()
		setLoading(true)

		if (value.username !== data.username || value.phone !== data.phone || value.password !== data.password) {
			axios.post(updateDataAPI, {
				"uid": data.id,
				"key": data.key,
				"newUsername": value.username,
				"newPhone": value.phone,
				"newPassword": value.password
			}).then(() => { window.location.reload() })
		}
		else {
			setExcuseYou(true)
			setOpen(false)
			setLoading(false)
		}
	}

	// const handleDelete = () => {
	//     setLoading(true)

	//     signOut(auth).then(() => {
	//         localStorage.removeItem('logInToken')
	//         localStorage.removeItem('user')
	//         axios.delete(deleteUserAPI, { data: { "email": data.emailAddress } }).then(() => {
	//             setLoading(false)
	//             navigate('/')
	//         })
	//     }).catch((error) => {
	//         console.log(error)
	//     })
	// }

	useEffect(() => {
		getUser()
		// eslint-disable-next-line
	}, [])

	return (
		<div className='userInfoAccess'>
			{loading ?
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
					<CircularProgress />
				</Box> :
				<div>
					<Card sx={{ maxWidth: 700 }}>
						<CardContent>
							<Typography gutterBottom variant="h5" component="div">
								User information
								<Stack alignItems='center' sx={{ m: 5 }}>
									<Avatar sx={{ width: 150, height: 150 }} alt='avatar' src='' />
								</Stack>
							</Typography>

							<Stack direction="row" spacing={1} sx={{ m: 2 }}>
								<TextField
									disabled
									sx={{ width: 0.9, m: 2 }}
									id="standard-basic"
									label="Email"
									variant="standard"
									defaultValue={data?.emailAddress} />
								<Tooltip title="Email is used for authentication !">
									<DoNotTouchIcon />
								</Tooltip>
							</Stack>

							<Stack direction="row" spacing={1} sx={{ m: 2 }}>
								<TextField
									sx={{ width: 0.9 }}
									id="standard-basic"
									label="Username"
									variant="standard"
									{...register('username', {
										required: { value: true, message: 'Username is required' },
										minLength: { value: 4, message: 'Type more! Why are u so sussy ? 😠' }
									})} />
							</Stack>
							{errors.username && <p style={{ margin: '20px', color: 'red' }}>{errors.username.message}</p>}

							<Stack direction="row" spacing={1} sx={{ m: 2 }}>
								<TextField
									sx={{ width: 0.9 }}
									id="standard-basic"
									label="Phone"
									variant="standard"
									{...register('phone', {
										required: { value: true, message: 'Phone is required' },
										pattern: { value: /^[0-9]*$/, message: 'Only numbers are allowed' }
									})} />
							</Stack>
							{errors.phone && <p style={{ margin: '20px', color: 'red' }}>{errors.phone.message}</p>}

							<Stack direction="row" spacing={1} sx={{ m: 2 }}>
								<TextField
									sx={{ width: 0.9 }}
									id="standard-basic"
									label="Password"
									variant="standard"
									{...register('password', {
										required: { value: true, message: 'Password is required' },
										minLength: { value: 6, message: 'Need at last 6 characters! 😡' }
									})} />
							</Stack>
							{errors.password && <p style={{ margin: '20px', color: 'red' }}>{errors.password.message}</p>}
						</CardContent>

						<CardActions>
							<Button variant="text" onClick={() => setOpen(true)} >Update</Button>
							<Button variant="text" onClick={() => navigate('/list')} >Back</Button>
						</CardActions>
					</Card>
					<Dialog
						open={openExcuseYou}
						onClose={() => setExcuseYou(false)}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogTitle id="alert-dialog-title">
							{"Excuse you!!🤨🤨🤨"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								I don't see any changes. Only change your information when needed.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setExcuseYou(false)} autoFocus>Sorry!</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						open={open}
						onClose={() => setOpen(false)}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogTitle id="alert-dialog-title">
							{"Wait!"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								Are you sure about making this change?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleSubmit(handleUpdate)}>I'm updating this account!</Button>
							<Button onClick={() => setOpen(false)} autoFocus>Never mind!</Button>
						</DialogActions>
					</Dialog>
				</div>
			}
		</div>
	)
}

export default UserPage