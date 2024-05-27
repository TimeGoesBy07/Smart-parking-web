import { useEffect, useState } from "react"
import "./style-park.css"
import { Box } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// import { getStorage, ref, getDownloadURL } from "firebase/storage"

function BKMap({ status }) {
	const [list, setList] = useState()
	const [floor, setFloor] = useState(0)

	const handleChange = (event) => {
		setFloor(event.target.value)
	}

	useEffect(() => { 
		console.log(status)
		setList(status) 
	}, [status])
	// const storage = getStorage()

	// getDownloadURL(ref(storage, '/car.png')).then((url) => {
	//     // Or inserted into an <img> element
	//     const img = document.getElementById('myimg');
	//     img.setAttribute('src', url);
	// }).catch((error) => {
	//     // Handle any errors
	// })

	const renderContent = () => {
		switch (floor) {
			case 0:
				return (<div className="map">
					<table id="floorPlan">
						<tr>
							<th>Wall</th>
							<th>Wall</th>
							<th>Wall</th>
							<th>Wall</th>
							<th>Wall</th>
							<th>Wall</th>
						</tr>
						<tr>
							{(list.slice(0, 4)).map((element, i) => {
								return (<>
									<td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
									{(i === 0 || i === 2) && <td></td>}
								</>
								)
							})}
						</tr>
						<tr>
							{(list.slice(4, 8)).map((element, i) => {
								return (<>
									<td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
									{(i === 0 || i === 2) && <td></td>}
								</>
								)
							})}
						</tr>
						<tr>
							{(list.slice(8, 12)).map((element, i) => {
								return (<>
									<td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
									{(i === 0 || i === 2) && <td></td>}
								</>
								)
							})}
						</tr>
					</table>
				</div>)
			case 1:
				return (
					<div className="map">
						<table id="floorPlan">
							<tr>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
							</tr>
							<tr>
								{(list.slice(12, 16)).map((element, i) => {
									return (<>
										<td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
										{(i === 0 || i === 2) && <td></td>}
									</>
									)
								})}
							</tr>
						</table>
					</div>
				)

			case 2:
				return (
					<div className="map">
						<table id="floorPlan">
							<tr>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
								<th>Wall</th>
							</tr>
							<tr>
								{(list.slice(16, 20)).map((element, i) => {
									return (<>
										<td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
										{(i === 0 || i === 2) && <td></td>}
									</>
									)
								})}
							</tr>
						</table>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<div style={{ margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
			{list && <div className="mapContainer">
				<Box sx={{ width: '10%', margin: '20px' }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Floor</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={floor}
							label="Floor"
							onChange={handleChange}>
							<MenuItem value={0}>Ground</MenuItem>
							<MenuItem value={1}>First</MenuItem>
							<MenuItem value={2}>Second</MenuItem>
						</Select>
					</FormControl>
				</Box>
				{renderContent()}
			</div>}
		</div>
	)
}

export default BKMap