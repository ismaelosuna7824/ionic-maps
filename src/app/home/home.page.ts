import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MapserviceService, Feature } from '../services/mapservice.service';
import { ToastController } from '@ionic/angular';

const { Geolocation } = Plugins;
declare var mapboxgl;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage   {
  latitude: number;
  longitude: number;

  addresses: any[] = [];
  selectedAddress = null;

  token = mapboxgl.accessToken = 'token';
  constructor (private service: MapserviceService ) { }
  async ionViewWillEnter(){
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    const map = this.service.mostrarMapa(this.longitude, this.latitude);
    const marker = this.service.market(map, this.longitude, this.latitude);
    marker.on('dragend', () => {
      this.onDragEnd(marker)
    });
    map.resize();
  }
   onDragEnd(ma) {
    let mas = ma.getLngLat();
     this.service.placename(mas.lng, mas.lat, this.token).subscribe(res => {
       this.selectedAddress = res['features'][0]['place_name'];
     })
  }


  location(){
    
    const map = this.service.mostrarMapa(this.longitude, this.latitude);
    const marker = this.service.market(map, this.longitude, this.latitude);
    marker.on('dragend', () => {
      this.onDragEnd(marker)
    });
    map.resize();
    this.addresses = [];
    this.selectedAddress ='';
    map.resize();
  }
  
  search(event: any) {
    this.addresses = [];
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.service
        .search_word(searchTerm, this.token)
        .subscribe((features: Feature[]) => {
          features.forEach(element=>{
            this.addresses.push({
              address: {
                name: element.place_name,
                lng: element.geometry['coordinates']['0'],
                lat: element.geometry['coordinates']['1']
              }
            })
          })
        });
      } else {
        this.addresses = [];
      }
  }
  onSelect(address, lng, lat) {
    this.selectedAddress = address;
    this.addresses = [];
    const map = this.service.mostrarMapa(lng, lat);
    const marker = this.service.market(map, lng, lat);
    marker.on('dragend', () => {
      this.onDragEnd(marker)
    });
    this.addresses = [];
    map.resize();
  }

  
}
