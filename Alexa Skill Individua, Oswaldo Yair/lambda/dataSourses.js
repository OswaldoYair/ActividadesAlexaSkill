const datasourceAutos = {
    "detailImageRightData": {
        "type": "object",
        "objectId": "detailImageRightSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://img.freepik.com/vector-premium/fondo-engranajes-grafico-futurista-azul-abstracto-sistema-engranajes-ruedas-informatica-e-ingenieria-digital-concepto-vector-tecnologia-futura-ilustracion-rueda-dentada-acero-transmision_102902-3739.jpg",
                    "size": "large"
                }
            ]
        },
        "title": "Recomendaciones",
        "subtitle": "Los mejores autos",
        "image": {
            "contentDescription": "",
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "%s"
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "%s"
            },
            "locationText": {
                "type": "PlainText",
                "text": "%s"
            },
            "secondaryText": {
                "type": "PlainText",
                "text": "%s"
            }
        }
    }
};

const datasourceInfo = {
    "headlineTemplateData": {
        "type": "object",
        "objectId": "headlineSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://img.freepik.com/vector-premium/fondo-tecnologia-abstracta-vectorial-fondo-azul-oscuro-ruedas-dentadas-azules-varias-ruedas-dentadas_250169-181.jpg",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Welcome to The Daily Plant Facts"
                }
            },
            "hintText": "Try, \"Alexa, what is the plant fact of the day?\"",
            "welcomeSpeechSSML": "<speak><amazon:emotion name='excited' intensity='medium'></amazon:emotion></speak>"
        },
        "transformers": [
            {
                "inputPath": "welcomeSpeechSSML",
                "transformer": "ssmlToSpeech",
                "outputName": "welcomeSpeech"
            }
        ]
    }
};

module.exports = {
    datasourceAutos,
    datasourceInfo
}