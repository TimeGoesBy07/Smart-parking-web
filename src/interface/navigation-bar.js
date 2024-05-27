import { useNavigate } from 'react-router'
import Button from '@mui/material/Button'
import './nav.css'
import { auth } from "../firebase/firebase"
import { signOut } from "firebase/auth"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import Avatar from '@mui/material/Avatar'
import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import LogoutIcon from '@mui/icons-material/Logout'

export default function ResponsiveAppBar() {
	const navigate = useNavigate()
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	const handleClick = (event) => setAnchorEl(event.currentTarget)

	const handleClose = () => setAnchorEl(null)

	const handlePages = (event) => {
		switch (event.currentTarget.id) {
			case 'personal':
				navigate('/userpage')
				break
			case 'list':
				navigate('/list')
				break
			case 'parking':
				navigate('/parkinglist')
				break
			case 'logout': {
				signOut(auth).then(() => {
					navigate('/')
					localStorage.removeItem('logInToken')
					localStorage.removeItem('user')
				}).catch((error) => {
					console.log(error)
				})

				break
			}
			default:
				navigate('/')
		}
	}

	return (
		<div>
			<header>
				<div className='logo' style={{width: '20%'}}>
					<img src='../hcmut.png' alt="404" style={{ transform: 'scale(0.7)' }} />
				</div>
				<Stack width='100%' direction='row' justifyContent="flex-end" alignItems="stretch" spacing={5} sx={{ m: 1, mr: 3 }}>
					<Typography
						gutterBottom
						variant="h5"
						component="div"
						fontSize='30px'
						textAlign='center'
						textTransform='uppercase'
						fontFamily='"Lucida Console", "Courier New", monospace'>
						smart parking management
					</Typography>
					<Button id="list" variant="text" onClick={handlePages}>Users List</Button>
					<Button id="parking" variant="text" onClick={handlePages}>Parking List</Button>
					<Avatar
						id="fade-button"
						aria-controls={open ? 'fade-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
						alt='avatar'
						src='' />
				</Stack>
				<Menu
					id="fade-menu"
					MenuListProps={{
						'aria-labelledby': 'fade-button',
					}}
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					TransitionComponent={Fade}
				>
					<MenuItem id='personal' onClick={handlePages}><AccountBoxOutlinedIcon style={{ margin: '3px' }} />Profile</MenuItem>
					<MenuItem id='logout' onClick={handlePages}><LogoutIcon style={{ margin: '3px' }} />Log out</MenuItem>
				</Menu>
			</header>
		</div>
	);
}
