import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { auth } from "../firebase/firebase"
import { useState } from "react"
import '../index.css'
import { signInWithEmailAndPassword } from "firebase/auth"
import { CircularProgress } from "@mui/material"
import { Card, CardContent, CardActions, TextField, Box, Typography } from "@mui/material"
import axios from "axios"

function LogIn() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const verifyAdmin = 'https://us-central1-smart-parking-369015.cloudfunctions.net/verifyAdmin'
    const formInfo = ['Email', 'Password']
    const navigate = useNavigate()

    const handleLogIn = (data, e) => {
        e.preventDefault()
        setLoading(true)

        signInWithEmailAndPassword(auth, data.Email, data.Password).then(() => {
            return auth.currentUser.getIdToken(true).then(idToken => ({ idToken }))
        }).then(({ idToken }) => {
            axios.post(verifyAdmin, { idToken: idToken }).then((response) => {
                if (response.data.message === "Welcome admin") {
                    let temp = Object.keys(response.data.data)[0]
                    localStorage.setItem('user', JSON.stringify(response.data.data[temp]))
                    localStorage.setItem('logInToken', true)
                    setLoading(false)
                    navigate('/list')
                }
                else {
                    // return to the login page 
                    navigate('/')
                }
            }).catch((error) => {
                setLoading(false)
                console.error(error)
            })
        }).catch((error) => {
            setLoading(false)
            console.error(error)
        })
    }

    return (
        <div className='userInfoAccess'>
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
                :
                <>
                    <Card sx={{ maxWidth: 500, marginTop: '20px' }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Log in
                            </Typography>
                            {formInfo.map(e => (
                                <div key={e}>
                                    <TextField
                                        sx={{ width: 0.9, m: 2 }}
                                        id="standard-basic"
                                        label={e}
                                        variant="standard"
                                        {...register(e, {
                                            required: { value: true, message: `${e} is required !` },
                                            pattern: {
                                                value: e === 'Email' ? /.+@.+\.[A-Za-z]+$/ : /.*/,
                                                message: e === 'Email' ? `That's not a valid email! 😞 ` : ''
                                            },
                                            minLength: e === 'Password' ? { value: 8, message: 'Need to have at last 6 characters!😠' } : undefined,
                                            maxLength: e === 'Password' ? { value: 20, message: 'Password is too long wtf ? 😡' } : undefined
                                        })} />
                                    {errors[e] && <p style={{ margin: '20px', color: 'red' }}>{errors[e].message}</p>}
                                </div>
                            ))}
                        </CardContent>

                        <CardActions sx={{ marginBottom: '20px' }}>
                            <button type="submit" className="back-btn" onClick={handleSubmit(handleLogIn)}>Submit</button>
                            <button type="button" className='back-btn' onClick={() => { navigate('/') }}><span className="text">Back</span></button>
                        </CardActions>
                    </Card>
                </>
            }
        </div>
    )
}

export default LogIn