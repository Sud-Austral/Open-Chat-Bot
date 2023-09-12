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
const getIncisos = x => incisos[parseInt(x)][12];

function query2(requestBody){
    let salida = "error"
    $.ajax({
        url: 'https://api-inference.huggingface.co/models/lmonsalve/Contitucion-15_lemm', // Reemplaza con la URL de la API que deseas consultar
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
        }
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
    "inputs": "Given the question delimited by triple backticks ```{" + x +"}```, what is the answer? Answer:{ Encontrado en los incisos: ",
    "parameters": {
    "max_length": 128, // Set the maximum response length to 128
    //'max_tokens': 2048,
    'temperature': 0,
    "repetition_penalty":1,
    "top_p":1,
    "top_k":1,
    "max_time":10
        }
    }};


function getBotResponse(input) {
    //return "Given the question delimited by triple backticks ```{jueces}```, what is the answer? Answer:{ Encontrado en los incisos:  223,333,468,469,471,476,478,484,490,494,497,498,500,503,505,508,509,510,511,512,35,65,247,461,488,520,528,543}"
    input = input.toLowerCase();
    let inputData = inputData2(input)
    let salida = query2(inputData);
    let acumulador = 1;
    let contador = 0;
    /*
    while(salida.split("Answer:{")[1].indexOf("}") === -1 && acumulador < 30){
        
        inputData["inputs"] = salida;
        salida = query2(inputData);
        console.log(acumulador,salida)
        acumulador++;
    }
    */
    let lista_incisos = salida.split("Answer:{")[1].split("}")[0].replace(/[^,\d]/g, '').split(",");
    //console.log(salida.split("Answer:{")[1])
    console.log(salida)
    //console.log(salida.split("Answer:{")[1])
    //console.log(lista_incisos)
    //return salida.split("Answer:{")[1];
    return "Ecnontrado en :"+lista_incisos.map(getIncisos).join(", ").replaceAll("Nº"," Inciso");
}