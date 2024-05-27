import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { auth } from "../firebase/firebase"
import '../index.css'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { CircularProgress, Card, CardActions, CardContent, TextField, Box, Typography } from "@mui/material"
import axios from "axios"

function SignUp() {
    const createAdmin = 'https://us-central1-smart-parking-369015.cloudfunctions.net/createAdmin'
    const { register, handleSubmit, formState: { errors } } = useForm()
    const formInfo = ['Username', 'Email', 'Phone', 'Password']
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = async (data, e) => {
        e.preventDefault()
        setLoading(true)

        await createUserWithEmailAndPassword(auth, data.Email, data.Password).then(userCredential => {
                console.log(userCredential)

                axios.post(createAdmin, {
                    "id": userCredential.user.uid,
                    "username": data.Username,
                    "emailAddress": data.Email,
                    "phone": data.Phone,
                    "password": data.Password,
                    "isAdmin": true
                }).then((response) => {
                        console.log(response.data)
                        setLoading(false)
                        navigate('/login')
                    })
            }).catch((error) => {
                setLoading(false)
                console.error(error);
            })
    }

    return (
        <div className='userInfoAccess'>
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box> :
                <>
                    <Card sx={{ maxWidth: 500, marginTop: '20px' }}>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Sign up
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
                                            validate: value => {
                                                if (e === 'Email') {
                                                    return /.+@.+\.[A-Za-z]+$/.test(value) || `That's not a valid email! 😞 `
                                                }
                                                else if (e === 'Phone') {
                                                    return /^[0-9]*$/.test(value) || `Only numbers are allowed 😞`
                                                }
                                            },
                                            pattern: {
                                                value: e === 'Email' ? /.+@.+\.[A-Za-z]+$/ : /.*/,
                                                message: e === 'Email' ? `That's not a valid email! 😞 ` : ''
                                            },
                                            minLength: e === 'Password' || e === 'Username' ? { value: 6, message: 'Need to have at last 6 characters!😠' } : undefined,
                                            maxLength: e === 'Password' || e === 'Username' ? { value: 20, message: `${e} is too long wtf ? 😡` } : undefined
                                        })} />
                                    {errors[e] && <p style={{ margin: '20px', color: 'red' }}>{errors[e].message}</p>}
                                </div>
                            ))}
                        </CardContent>

                        <CardActions sx={{ marginBottom: '20px' }}>
                            <button type="submit" className="back-btn" onClick={handleSubmit(handleSignUp)}>Submit</button>
                            <button type="button" className='back-btn' onClick={() => { navigate('/') }}><span className="text">Back</span></button>
                        </CardActions>
                    </Card>
                </>
            }
        </div>
    );
}

export default SignUp