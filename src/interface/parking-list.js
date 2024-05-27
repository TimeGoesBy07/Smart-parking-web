import { Stack, TextField, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"
import { TableContainer, TablePagination, TableCell, Dialog, Table, TableBody, TableHead, TableRow } from "@mui/material"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import InfoIcon from '@mui/icons-material/Info';
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router"
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import axios from "axios"
import { useForm } from "react-hook-form"
import ResponsiveAppBar from "./navigation-bar"
import GgMap from "./map"

function ParkingList() {
	const parkingListAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/displayParkingList'
	const deleteParkingLot = 'https://us-central1-smart-parking-369015.cloudfunctions.net/deleteParkingLot'
	const [parkingList, setParkingList] = useState([])
	const [baseList, setBaseList] = useState([])
	const [currentTarget, setTarget] = useState(0)
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [noParkingLot, setNoParkingLot] = useState(false)
	const navigate = useNavigate()
	const { handleSubmit } = useForm()
	const [input, setInput] = useState('')
	const [page, pagechange] = useState(0)
	const [rowperpage, rowperpagechange] = useState(5)

	const columns = [
		{ id: 'id', name: 'ID' },
		{ id: 'name', name: 'Name' },
		{ id: 'location', name: 'Location' },
		{ id: 'price', name: 'Price per Hour (VND)' },
		{ id: 'action', name: 'Action' }
	]

	const handleClickOpen = (targetItem) => {
		setOpen(true)
		setTarget(targetItem)
	}

	const callListData = () => {
		setLoading(true)
		setNoParkingLot(false)

		axios.get(parkingListAPI).then((response) => {
			setParkingList(Object.values(response.data))
			setBaseList(Object.values(response.data))
			setLoading(false)
		}).catch((error) => {
			setNoParkingLot(true)
			setLoading(false)
			console.log('No parking lots found', error)
		})
	}

	const handlechangepage = (event, newpage) => pagechange(newpage)

	const handleRowsPerPage = (event) => {
		rowperpagechange(+event.target.value)
		pagechange(0)
	}

	const onSubmit = () => {
		setNoParkingLot(false)

		if (input !== '') {
			const tempList = baseList.filter(val => {
				let temp = Object.keys(val)[0]

				return val[temp].name.toLowerCase().includes(input.toLowerCase()) || val[temp].location.toLowerCase().includes(input.toLowerCase())
			})

			tempList.length === 0 ? setNoParkingLot(true) : setParkingList(tempList)
		}
	}

	const handleDelete = (id) => {
		axios.delete(deleteParkingLot, { data: { "id": id } }).then(() => {
			console.log("Data removed successfully.")
			callListData()
		}).catch(error => console.error("Error removing data: ", error))
	}

	const handleRefresh = () => {
		callListData()
		setInput('')
	}

	const handleClose = () => setOpen(false)

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
					<h1>List of car parks</h1>
				</div>
				{loading === false && <Stack
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
						onChange={e => setInput(e.target.value)} />
					<SearchIcon onClick={handleSubmit((onSubmit))} />
					<RefreshIcon onClick={handleRefresh} />
					<Button sx={{ m: 3 }} variant="text" onClick={() => navigate('/addparkinglot')}>Add a new parking lot</Button>
				</Stack>}
				<Paper sx={{ width: '90%', margin: 'auto', marginBottom: '20px' }}>
					<TableContainer sx={{ maxHeight: 450, width: '100%' }} component={Paper}>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell align="left" style={{ backgroundColor: 'black', color: 'white' }} key={column.id}>{column.name}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{noParkingLot ?
									<TableRow>
										<TableCell>No parking lot found</TableCell>
									</TableRow> :
									(loading ?
										<TableRow>
											<TableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
												<CircularProgress />
											</TableCell>
										</TableRow>
										:
										parkingList
											.slice(page * rowperpage, page * rowperpage + rowperpage)
											.map(row => {
												let temp = Object.keys(row)[0]

												return (
													<TableRow key={row[temp].key}>
														<TableCell sx={{ width: '20%' }} >
															{row[temp].key}
														</TableCell>
														<TableCell sx={{ width: '20%' }} >
															{row[temp].name}
														</TableCell>
														<TableCell sx={{ width: '20%' }} >
															{row[temp].location}
														</TableCell>
														<TableCell sx={{ width: '20%' }} >
															{row[temp].price}
														</TableCell>
														<TableCell sx={{ width: '10%' }} >
															<Stack
																direction="row"
																divider={<Divider orientation="vertical" flexItem />}
																spacing={2}
															>
																<InfoIcon onClick={() => navigate(`/parkinglist/${row[temp].id}/${row[temp].key}`)} />
																<DeleteIcon onClick={() => handleClickOpen(row[temp].id)} />
															</Stack>
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
						count={parkingList.length}
						component="div"
						onPageChange={handlechangepage}
						onRowsPerPageChange={handleRowsPerPage}>
					</TablePagination>
				</Paper>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">
						{"Stop!"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Do you want to proceed ?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => {
							handleDelete(currentTarget)
							handleClose()
						}}>Yeah! Do it!</Button>
						<Button onClick={handleClose} autoFocus>Never mind!</Button>
					</DialogActions>
				</Dialog>
			</div>
			<div style={{ margin: 'auto', height: '80vh', width: '90%', marginTop: '20px', zIndex: '-1' }}>
				<GgMap />
			</div>
		</div>
	)
}

export default ParkingList