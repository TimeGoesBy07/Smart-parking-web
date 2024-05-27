import { useEffect, useState } from "react"
import "./style-park.css"
import { getStorage, ref, getDownloadURL } from "firebase/storage"

function HVTMap({ status }) {
    const [list, setList] = useState()
    const storage = getStorage()

    useEffect(() => { setList(status) }, [status])

    getDownloadURL(ref(storage, '/hvt.jpg')).then((url) => {
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
    }).catch((error) => {
        // Handle any errors
    })

    return (
        <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
            {list && <div className="mapContainer">
                <img id='myimg' src='' alt='' style={{ width: '50%', margin: 'auto', display: 'block', marginTop: '20px' }} />
                <div className="map">
                    <table id="floorPlan" style={{ textAlign: 'center' }}>
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
                                    {(i === 0 || i === 2) && <td> | </td>}
                                </>
                                )
                            })}
                        </tr>
                        <tr>
                            {(list.slice(4, 8)).map((element, i) => {
                                return (<>
                                    <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
                                    {(i === 0 || i === 2) && <td> | </td>}
                                </>
                                )
                            })}
                        </tr>
                        <tr>
                            {(list.slice(8, 12)).map((element, i) => {
                                return (<>
                                    <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
                                    {(i === 0 || i === 2) && <td> | </td>}
                                </>
                                )
                            })}
                        </tr>
                        <tr>
                            {(list.slice(12, 16)).map((element, i) => {
                                return (<>
                                    <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
                                    {(i === 0 || i === 2) && <td> | </td>}
                                </>
                                )
                            })}
                        </tr>
                        <tr>
                            {(list.slice(16, 20)).map((element, i) => {
                                return (<>
                                    <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'}` }}>{Object.keys(element)[0]}</td>
                                    {(i === 0 || i === 2) && <td> | </td>}
                                </>
                                )
                            })}
                        </tr>
                        <tr>
                            <td> Entrance ={">"} </td>
                            <td> | </td>
                            <td> | </td>
                            <td> | </td>
                            <td> | </td>
                            <td> Exit ={">"} </td>
                        </tr>
                    </table>
                </div>
            </div>}
        </div>
    )
}

export default HVTMap   