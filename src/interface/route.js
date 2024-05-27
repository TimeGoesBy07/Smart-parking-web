import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import { useRef } from 'react'

function OnBuildRoute({ pos: props, des: destination, signal: sign }) {
    const map = useMap()
    let eins = useRef(null)

    if (sign === 'yes') {
        if (eins.current !== null)
            map.removeLayer(eins.current)
        else {
            eins.current = L.Routing.control({
                waypoints: [
                    L.latLng(props),
                    L.latLng(destination)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: true,
                createMarker: function () { return null }
            }).addTo(map)
        }
    }

    if (sign === 'no' && eins.current !== null) {
        eins.current.setWaypoints([])
        map.removeControl(eins.current)
        eins.current = null
    }

    return null
}

export default OnBuildRoute