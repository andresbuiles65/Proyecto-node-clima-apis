require('dotenv').config()

const { leerInput, inquirerMenu,pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
const main = async() =>{
    console.clear();
    let opt ;
    const busquedas = new Busquedas();


    do {
        opt = await inquirerMenu();
        switch(opt){
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad:');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);

                if(id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id );

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);
                
                // Clima

                const weather = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                
                
                //const idm = await listarLugares(lugares);
                //const LugarMap = lugares.find(l =>l. === idm );
                //console.log(weather);
                // Mostrar resultados
                console.log('\n Información de la ciudad \n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:',lugarSel.lng);
                console.log('Temperatura:',weather[0].temp);
                console.log('Miníma:',weather[0].min);
                console.log('Máxima:',weather[0].max);
                console.log('Descripcion:',weather[0].desc);
            break;

            case 2:
                busquedas.historial.forEach( (lugar, i)=>{
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`);
                }  )


            break;
        }
       if(opt !==0) await pausa();

      } while (opt !== 0);
    };
 main();
