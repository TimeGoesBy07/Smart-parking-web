import '../index.css'
import { useNavigate } from 'react-router'
import { Stack, Typography } from '@mui/material'

function Icon() {
    const navigate = useNavigate()

    const handleLogIn = () => {
        (localStorage.getItem('logInToken') === null || localStorage.getItem('logInToken') === 'false') ? navigate('/login') : navigate('/list')
    }

    return (
        <div className='icon-face'>
            <Stack>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontSize='35px'
                    textAlign='center'
                    textTransform='uppercase'
                    fontFamily='"Lucida Console", "Courier New", monospace'>
                    smart parking management
                </Typography>
                <div className='logo'>
                    <img src='../hcmut.png' alt="404" />
                </div>
                <div className='userAccess'>
                    <button className='interface-btn' onClick={() => handleLogIn()} > LOG IN </button>
                    <button className='interface-btn' onClick={() => navigate('/signup')} > SIGN UP </button>
                </div>
            </Stack>
        </div>
    );
}

export default Icon