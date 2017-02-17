import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import { GoogleMaps } from '../../providers/google-maps';
import { GoogleMapsCluster } from '../../providers/google-maps-cluster';
import { ListWithStorePage } from '../list-with-store/list-with-store';
import { PscDetailPage } from '../psc-detail/psc-detail';
import { PopoverPage } from '../popover-page/popover-page';
import { Store } from '../../providers/store';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import * as distanceAPI from 'google-distance';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
declare var google: any;
@Component({
  selector: 'page-map-with-store',
  templateUrl: 'map-with-store.html'
})
export class MapWithStorePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  map: any;
  markerCluster: any;
  locations: any[] = [];
  currentLocation: any;
  onlyLatLngLocations: any[] = [];
  markers: any = [];
  bounds: any;
  constructor(public navCtrl: NavController, private popoverCtrl: PopoverController, public platform: Platform, public maps: GoogleMaps) {
    this.locations = Store.STORES_JSON;
    distanceAPI.apiKey = 'AIzaSyAw-nFMN2BmqvIJFVdtMqe6shhZQq7uuVA';
  }

  ionViewDidLoad(): void {
    this.platform.ready().then(() => {
      console.log('loading map');
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then((map) => {
        this.map = map;
        this.bounds = new google.maps.LatLngBounds();
        this.addMarkerswithCluster(map, this.locations);
      });
      /*this.maps.getCurrentLocation().then(res => {
        this.currentLocation = res.coords.latitude + ',' + res.coords.longitude;
        console.log(this.currentLocation);
      });*/
      this.locations.forEach((item, index, arr) => {
        this.onlyLatLngLocations.push(item.Latitude + ',' + item.Longitude);
      });
    });

  }

  ionViewDidEnter() {

  }
  tolistwithStores() {
    this.navCtrl.setRoot(ListWithStorePage);
  }

  presentPopover(ev) {

    let popover = this.popoverCtrl.create(PopoverPage, {
    });

    popover.present({
      ev: ev
    });
    popover.onDidDismiss((rangeinkm) => {
      // Math.round(37058 / 1000);
      //if (this.currentLocation) {
      this.getNearbyLocations('40.784212, -75.715123', this.onlyLatLngLocations)
        .then(res => {
          var nearbylocations: any[] = [];
          for (var i = 0; i < res.length; i++) {
            if (Math.round(res[i].distanceValue / 1000) < rangeinkm) {
              nearbylocations.push(this.locations[i]);
            }
          }
          console.log(nearbylocations);
          this.clearMarkers();
          this.bounds = new google.maps.LatLngBounds();
          this.maps.initMap().then(map => {
          this.addMarkerswithCluster(map, nearbylocations);
           })
        })
        .catch(err => { });
      //}
      console.log(this.onlyLatLngLocations);
      console.log(this.currentLocation);
      //this.addMarkerswithCluster(this.map, this.locations);
    })
  }
  clearMarkers() {
    setTimeout(() => {
      console.log(this.markers);
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markerCluster.clearMarkers();
      this.markers = [];
      this.bounds = null;
    }, 0);

  }
  addMarkerswithCluster(map, locations: any[]) {

    if (google.maps) {
      //AIzaSyAw-nFMN2BmqvIJFVdtMqe6shhZQq7uuVA
      //Convert locations into array of markers
      console.log(locations);
      this.markers = locations.map((item) => {
        this.bounds.extend(new google.maps.LatLng(item.Latitude, item.Longitude));
        let marker = new google.maps.Marker({
          position: { lat: item.Latitude, lng: item.Longitude },
          label: item.PSCName,
          map: map
        });
        marker.set('id', item.ClientID);
        this.attachmyEvents(marker);
        return marker;
      });
      console.log(this.markers);
      this.markerCluster = new MarkerClusterer(map, this.markers, { imagePath: 'assets/img/m' });
      map.fitBounds(this.bounds);
    } else {
      console.warn('Google maps needs to be loaded before adding a cluster');
    }

  }

  attachmyEvents(marker) {
    marker.addListener('click', () => {
      console.log(marker.get('id'));
      let selected_marker = this.locations.filter((item) => {
        return item.ClientID == marker.get('id');
      });
      this.navCtrl.push(PscDetailPage, selected_marker[0])
    });
  }

  getNearbyLocations(origins, destinations): Promise<any> {
    return new Promise((resolve, reject) => {
      distanceAPI.get(
        {
          origins: [origins],
          destinations: destinations,
          sensor: true
        },
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        }
      )
    });
  }
}
