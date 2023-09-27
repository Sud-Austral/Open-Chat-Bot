let GLOBALPALABRA = ""

function getData(urlData) {
    let rawData;
    $.get({
        url: urlData,
        success: data => rawData = data, 
        error: () => console.log("No File in " + urlData),       
        async: false
    });
      
    let dataJson = rawData? JSON.parse(rawData): null;
    return dataJson;
}
const incisos = getData("https://raw.githubusercontent.com/Sud-Austral/IA_1/main/incisos.json")
const getIncisos = x => `<div class="respuesta" onclick='renderIncisoTable(${x});'>${incisos[parseInt(x)][0]} ${incisos[parseInt(x)][12]}</div>`;

function query2(requestBody){
    let salida = "error"
    $.ajax({
        //url: 'https://api-inference.huggingface.co/models/lmonsalve/Contitucion-15_lemm', // Reemplaza con la URL de la API que deseas consultar
        url: 'https://api-inference.huggingface.co/models/lmonsalve/Contitucion-15_lemm_tilde_interseccion', 
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(requestBody),
        headers: {
            "Authorization": "Bearer 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", // Ejemplo de encabezado de autorización
            'Content-Type': 'application/json' // Tipo de contenido
        },
        async: false, // Establece la llamada como síncrona
        success: function(data) {
            salida = data[0]["generated_text"]
            //salida = data[0][generated_text];
        },
        error: function(xhr, status, error) {
            //console.error(error,xhr,status);
            salida = xhr.responseJSON.error;
            console.log(salida)
        },
        /*
        finally:function(){
            salida = "error";
        }*/
    });
    return salida;
}

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/lmonsalve/Contitucion-15_lemm",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
    
	return result;
}

const inputData2 = x => { 
    return {
    "inputs": "Given the question delimited by triple backticks ```{" + x +"}```, what is the answer? Answer:{ Encontrado en los incisos:",
    "parameters": {
    "max_length": 228, // Set the maximum response length to 128
    //'max_tokens': 2048,
    /*
    Parametros  Contitucion-15_lemm
    'temperature': 0,
    "repetition_penalty":.8,
    "top_p":1,
    "top_k":100,
    "max_time":10
    Temperature: 1.0
    Repetition penalty: 0.5
    Top_p: 0.9
    Top_k: 50
    'temperature': 0.1,
    "repetition_penalty":.6,
    "top_p":.01,
    "top_k":1,
    */
    //"repetition_penalty":.7,
    //"top_p":.3,
    //'top_k':30,
    //"top_p":.85,
    //"top_k":50,
    //"repetition_penalty":1.2,
    //'temperature': .7,
    }
}};


const errores = {"Task not found for this model":"No se encontro el modelo",
                "Model lmonsalve/Contitucion-15_lemm_tilde is currently loading":"El módelo se esta cargando",
                "Model lmonsalve/Contitucion-15_lemm is currently loading":"El módelo se esta cargando"    
            }


function cleanListaIndecisos(salida){
    for (let index = 0; index < 100; index++) {        
        lista_incisos = salida.split("Answer:{")[1].split("}")[index].replace(/[^,\d]/g, '').split(",").filter(x => x !== "");
        if(lista_incisos.length > 0){
            console.log(lista_incisos)
            return lista_incisos;
        }
    }
    return [];
}


function getBotResponse(input) {
    //return "Given the question delimited by triple backticks ```{jueces}```, what is the answer? Answer:{ Encontrado en los incisos:  223,333,468,469,471,476,478,484,490,494,497,498,500,503,505,508,509,510,511,512,35,65,247,461,488,520,528,543}"
    input = input.toLowerCase();
    GLOBALPALABRA = input;
    let inputData = inputData2(input);
    console.log(inputData)
    let salida = query2(inputData);
    let lista_incisos;
    //console.log(salida.split("Answer:{")[1].split("}")[1].replace(/[^,\d]/g, '').split(","))
    try{
        //lista_incisos = salida.split("Answer:{")[1].split("}")[0].replace(/[^,\d]/g, '').split(",");
        lista_incisos = cleanListaIndecisos(salida)
    }catch(error){
        try {
            lista_incisos = salida.split("Answer:{")[1].split("}")[1].replace(/[^,\d]/g, '').split(",");
            console.log(lista_incisos)
        } catch (error) {
            return errores[salida];
        }        
    }
    lista_incisos = [...new Set(lista_incisos.filter(x => x !== ""))];
    console.log(salida)
    console.log(lista_incisos)
    if(lista_incisos.length == 0){
        return "Aun estamos trabajando, pero no pudimos encontrar tu concepto..."
    }
    return "Encontrado en : <div class='respuesta_padre'>"+lista_incisos.map(getIncisos).join(" ").replaceAll("Nº"," Inciso")+"</div>";
}

query2("hola");