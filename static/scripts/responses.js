function query2(requestBody){
    let salida = ""
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
            console.error(error,xhr,status);
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
    "options": {
    "max_length": 228 // Set the maximum response length to 128
        }
    }};




function getBotResponse(input) {
    //return "Given the question delimited by triple backticks ```{jueces}```, what is the answer? Answer:{ Encontrado en los incisos:  223,333,468,469,471,476,478,484,490,494,497,498,500,503,505,508,509,510,511,512,35,65,247,461,488,520,528,543}"
    input = input.toLowerCase();
    console.log(input)
    let inputData = inputData2(input)

    let salida = query2(inputData);
    let acumulador = 1;
    while(salida.split("Answer:{")[1].indexOf("}") === -1 && acumulador < 20){
        inputData["inputs"] = salida;
        salida = query2(inputData);
        console.log(acumulador,salida)
        acumulador++;
    }
    
    /*
    console.log(1,salida)
    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(2,salida)
    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(3,salida)
    
    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(4,salida)

    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(5,salida)

    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(6,salida)

    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(7,salida)


    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(8,salida)


    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(9,salida)


    inputData["inputs"] = salida;
    salida = query2(inputData);
    console.log(10,salida)
    */
    return salida.split("Answer:{")[1];
    
    /*
    query(inputData)
    .then((response) => {
        console.log(1,JSON.stringify(response));
        //console.log(2,response[0]["generated_text"]);
        inputData["inputs"] = response[0]["generated_text"];
        salida = response[0]["generated_text"];
    })
    
    setTimeout(function() {
        // Tu código que se ejecutará después de 10 segundos
        console.log(2,salida)
        return salida;
      }, 10000);
    
    */
    /*
    //rock paper scissors
    if (input == "rock") {
        return "paper";
    } else if (input == "paper") {
        return "scissors";
    } else if (input == "scissors") {
        return "rock";
    }

    // Simple responses
    if(input == "hola"){
        return "Pregunta otra cosa"
    }
    if (input == "hello") {
        return "Hello there!";
    } else if (input == "goodbye") {
        return "Talk to you later!";
    } else {
        return "Try asking something else!";
    }
    */
}