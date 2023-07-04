const fs = require('fs');
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath ='./db/database.json';

  constructor() {
    // Leer DB si existe
    this.leerDB();
  }


  get historialCapitalizado(){
    
    return this.historial
  }

  async longandlat(){
    const resp = await instance.get();
        return resp.data.features.map(lugar =>({
          lng: lugar.center[0],
          lat: lugar.center[1],
        }));



  }

  get paramsMapbox(){
    return{
    'access_token':process.env.MAPBOX_KEY,
    'limit':5,
    'language':'es'
    }
  }

  get openweather(){
    return{
      'appid': process.env.OPENWEATHER_KEY,
      'units':'metric',
      'lang': 'es'
    }
  }

  // Métodos
  async ciudad(lugar = "") {
    try {
        // Petición HTTP
        // Método Crear
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramsMapbox

        });
        const resp = await instance.get();
        return resp.data.features.map(lugar =>({
          id: lugar.id,
          nombre: lugar.place_name,
          lng: lugar.center[0],
          lat: lugar.center[1],

        }));
      
      //const resp = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/johan.json?proximity=ip&language=es&access_token=pk.eyJ1IjoiYW5kcmVzMjk2NSIsImEiOiJjbGpoamRvdHgwaWc0M29uNmJtM29rMTF5In0.-1pIj1pmtslidth9i-jkPA");
     

       // Retornar los lugares
    } catch (error) {}
    return[];
    
    // console.log('Ciudad', lugar);
  }

  async climaLugar(lat, lon){
    let a =5;

    try {
      // Petición HTTP
      const instancia = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
        params: this.openweather
      });
      const answer = await instancia.get();
      const other = answer.data.main;
      const tempe = other.temp;
      const maxtemp = other.temp_max;
      const mintemp = other.temp_min;
      return answer.data.weather.map(mapeo =>({
        id:mapeo.id,
        desc: mapeo.description,
        //temp: other.temp,
        //max: other.temp_max
        temp: tempe,
        min: mintemp,
        max: maxtemp
        
      }))
      
    } catch (error) {
      console.log(error); 
    }

  }

  agregarHistorial(lugar =''){
    
    if(this.historial.includes(lugar.toLocaleLowerCase())){   //TODO: PREVENIR DUPLICADOS
      return;
    }

    this.historial = this.historial.splice(0,7);
    this.historial.unshift(lugar);
    // Grabar en DB
    this.guardarDB();
  }

  guardarDB(){
    const payload ={
      historial: this.historial
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));

  }

  leerDB(){

    if(!fs.existsSync(this.dbPath))return;

      const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
      const data = JSON.parse(info);
      this.historial = data.historial;

    // Debe de existir ...
    // const info .... readfylesync....path....{encoding:utf-8}
   // Se modifica el valor de la propiedad 

  }

}

module.exports = Busquedas;
