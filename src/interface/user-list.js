import { Stack, TextField, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"
import { TableContainer, TablePagination, TableCell, Table, TableBody, TableHead, TableRow } from "@mui/material"
import BuildIcon from '@mui/icons-material/Build'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router"
import ResponsiveAppBar from "./navigation-bar"
import axios from "axios"
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { useForm } from "react-hook-form"
import Graph from "./graph"

function UsersList() {
    const displayUsersListAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/displayUsersList'
    const [usersList, setUsersList] = useState([])
    const [loading, setLoading] = useState(false)
    const [noUserFound, setNoUser] = useState(false)
    const { handleSubmit } = useForm()
    const [page, pagechange] = useState(0)
    const [rowperpage, rowperpagechange] = useState(5)
    const [input, setInput] = useState('')
    const [baseList, setBaseList] = useState([])
    const navigate = useNavigate()

    const columns = [
        { id: 'id', name: 'ID' },
        { id: 'email', name: 'Email' },
        { id: 'username', name: 'Username' },
        { id: 'phone', name: 'Phone' },
        { id: 'action', name: 'Action' }
    ]

    const handleRefresh = () => callListData()

    const callListData = () => {
        setLoading(true)
        setNoUser(false)

        axios.get(displayUsersListAPI).then(response => {
            setUsersList(Object.values(response.data))
            setBaseList(Object.values(response.data))
            setLoading(false)
        }).catch((error) => {
            setNoUser(true)
            setLoading(false)
            console.log('No user found', error)
        })
    }

    const handlechangepage = (event, newpage) => pagechange(newpage)

    const handleRowsPerPage = (event) => {
        rowperpagechange(+event.target.value)
        pagechange(0)
    }

    const onSubmit = () => {
        setNoUser(false)

        if (input !== '') {
            const tempList = baseList.filter(val => {
                let temp = Object.keys(val)[0]
                console.log(val[temp].emailAddress)

                return val[temp].username.toLowerCase().includes(input.toLowerCase()) || val[temp].emailAddress.toLowerCase().includes(input.toLowerCase())
            })

            tempList.length === 0 ? setNoUser(true) : setUsersList(tempList)
        }
    }

    useEffect(() => {
        callListData()
        // eslint-disable-next-line
    }, [])

    return (
        <div className='homepage'>
            <ResponsiveAppBar />
            <div style={{ margin: '10px' }}>
                <div style={{
                    width: '100%',
                    textTransform: 'uppercase',
                    fontSize: '15px',
                    textAlign: 'center',
                    marginTop: '50px',
                    fontFamily: '"Lucida Console", "Courier New", monospace'
                }}>
                    <h1>List of users</h1>
                </div>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ mt: 5, mb: 8 }} >
                    <TextField
                        id="standard-basic"
                        label="Search"
                        variant="standard"
                        sx={{ width: 500 }}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <SearchIcon onClick={handleSubmit((onSubmit))} />
                    <RefreshIcon onClick={handleRefresh} />
                    <Button sx={{ m: 3 }} variant="text" onClick={() => navigate('/userForm')}>Create a new user</Button>
                </Stack>
                <Paper sx={{ width: '90%', margin: 'auto' }}>
                    <TableContainer sx={{ maxHeight: 450, minWidth: 650 }} component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell align="left" style={{ backgroundColor: 'black', color: 'white' }} key={column.id}>{column.name}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {noUserFound ?
                                    <TableRow>
                                        <TableCell>No user found</TableCell>
                                    </TableRow>
                                    : (
                                        loading ?
                                            <TableRow>
                                                <TableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>
                                            :
                                            usersList
                                                .slice(page * rowperpage, page * rowperpage + rowperpage)
                                                .map(row => {
                                                    let temp = Object.keys(row)[0]

                                                    return (
                                                        <TableRow key={row[temp].key}>
                                                            <TableCell sx={{ width: '30%' }}>{row[temp].key}</TableCell>
                                                            <TableCell sx={{ width: '30%' }}>{row[temp].emailAddress}</TableCell>
                                                            <TableCell sx={{ width: '20%' }}>{row[temp].username}</TableCell>
                                                            <TableCell sx={{ width: '20%' }}>{row[temp].phone}</TableCell>
                                                            <TableCell><BuildIcon onClick={() => navigate(`/list/${row[temp].id}`)} /></TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        rowsPerPage={rowperpage}
                        page={page}
                        count={usersList.length}
                        component="div"
                        onPageChange={handlechangepage}
                        onRowsPerPageChange={handleRowsPerPage}
                    >
                    </TablePagination>
                </Paper>
                <Graph />
            </div>
        </div>
    )
}

export default UsersList