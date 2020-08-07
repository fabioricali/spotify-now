import {Component, tag} from 'doz'

@tag('page-about')
export default class extends Component {
    props = {
        title: 'About'
    };

    template(h) {
        return h`
            <div>
                 <h1>${this.props.title}</h1>
                 <p>
                     This simple app shows the songs listened to simultaneously.<br>
                     The data are taken from 
                     <a style="color: white" href="https://listeningtogether.atspotify.com" target="_blank">
                        listeningtogether.atspotify.com
                     </a>.
                 </p>
            </div>
        `
    }

    onMount() {
        this.metaTag({
            title: 'About',
            description: 'My About Page'
        });
    }
}
