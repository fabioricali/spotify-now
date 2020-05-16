import {Component, tag} from 'doz'

function distance(lat1, lon1, lat2, lon2) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;

    return Math.floor(12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
}

@tag('page-home')
export default class extends Component {
    props = {
        title: 'Home',
        tracks: []
    };

    template(h) {
        return h`
            <style>
                .tracks {
                    text-align: left;
                }
                
                .track {
                    border-bottom: 1px solid #555;
                    padding: 8px;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                }
                
                .track-cover {
                    margin-right: 8px;
                }
                
                .track-info {
                    width: 50%;
                }
                
                .track-cover img {
                    width: 64px;
                    height: 64px;
                    object-fit: cover;
                    display: block;
                    border-radius: 50%;
                    border: 2px solid greenyellow;
                }
                
                .track-info-artist {
                    font-weight: bold;
                }
                
                .track-locations {
                    width: 50%;
                }
            </style>
            <h3>Listening together, in different places, in the world.</h3>
            <div class="tracks">
                ${this.props.tracks.map(item => h`
                    <div class="track" key="${item.track.artists + item.track.name}"> 
                        <div class="track-cover"> 
                            <img src="${item.track.image ? item.track.image.url : ''}">
                        </div>
                        <div class="track-info">
                            <div class="track-info-artist">${item.track.artists}</div>
                            <div class="track-info-title">${item.track.name}</div>
                        </div> 
                        <div class="track-locations"> 
                            ${item.locations.map(location => h`
                                <div class="track-locations-location">
                                    ${location.country} - ${location.city}
                                </div>
                            `)}
                            <div class="track-locations-distance"> 
                                Distance: ${distance(item.locations[0].latitude, item.locations[0].longitude, item.locations[1].latitude, item.locations[1].longitude)} km
                            </div>
                        </div>   
                    </div>
                `)}
            </div>
        `
    }

    /*
    0: {locations: Array(2), track: {…}, special: true}
1:
locations: Array(2)
0: {country: "Brazil", city: "Rio das Ostras", latitude: -22.4545, longitude: -41.9492}

     */
    async onMount() {
        this.metaTag({
            title: 'Home',
            description: 'My Home Page'
        });

        if (this.isSSR()) return;

        await this.fetchData();
        this._timerInterval = setInterval(async () => this.fetchData(), 10000);
    }

    async fetchData() {
        let response = await fetch('https://listeningtogether.atspotify.com/data');
        //this.props.tracks = [];
        this.props.tracks = (await response.json()).tracks;
        //console.log(this.props.tracks)
    }

    onUnmount() {
        clearInterval(this._timerInterval);
    }
}
