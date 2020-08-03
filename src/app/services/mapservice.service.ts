import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
declare var mapboxgl;
export interface MapboxOutput {

  features: Feature[];
  
}

export interface Feature {
  place_name: string;
  geometry: any
}

@Injectable({
  providedIn: 'root'
})


export class MapserviceService {

  constructor(private http: HttpClient) { }

  mostrarMapa(lng, lat ){
   
    return new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [lng, lat ],
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true,
      });
      
  }
  market(map, lng, lat){
    return new mapboxgl.Marker({
      draggable:true,
        })
        .setLngLat([ lng, lat])
        .addTo(map);
         
        
  }
  placename(lng, lat, token){
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${token}`;
    return this.http.get(url);
  }
  search_word(query: string, token) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(`${url}${query}.json?types=address&access_token=${token}`)
    .pipe(map((res: MapboxOutput) => {
      return res.features;
    }));
  }
}
