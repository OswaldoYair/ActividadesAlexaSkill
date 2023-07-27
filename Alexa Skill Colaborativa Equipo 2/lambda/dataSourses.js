const datasourceIndex = {
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
                        "url": "https://c4.wallpaperflare.com/wallpaper/232/159/577/adult-doctor-girl-healthcare-wallpaper-preview.jpg",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Search + Salud"
                }
            },
            "logoUrl": "https://github.com/SergioooAGS/ProyE/blob/main/REMASTER.png?raw=true",
            "hintText": "Prueba a decir, 'Alexa Muestrame las enfermedades mas comunes'",
            "welcomeSpeechSSML": "<speak><amazon:emotion name='excited' intensity='medium'>Welcome to The Daily Plant Facts</amazon:emotion></speak>"
        },
        "transformers": [
            {
                "inputPath": "welcomeSpeechSSML",
                "transformer": "ssmlToSpeech",
                "outputName": "welcomeSpeech"
            }
        ]
    }
}

const datasourceCatalogo = {
    "textListData": {
        "type": "object",
        "objectId": "textListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://images.unsplash.com/photo-1588421357574-87938a86fa28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
                    "size": "large"
                }
            ]
        },
        "title": "Recomendaciones",
        "listItems": [
            {
                "primaryText": "Diabetes de los tres tipos",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[0].primaryText} fue seleccionada"
                    }
                ]
            },
            {
                "primaryText": "Colesterol",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[1].primaryText} fue seleccionada"
                    }
                ]
            },
            {
                "primaryText": "Artritis",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[2].primaryText} fue seleccionada"
                    }
                ]
            },
            {
                "primaryText": "Hipertension",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[3].primaryText} fue seleccionada"
                    }
                ]
            },
            {
                "primaryText": "Insuficiencia cardiaca",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[4].primaryText} fue seleccionada"
                    }
                ]
            }
        ],
        "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Cruz_Roja.svg/2048px-Cruz_Roja.svg.png"
    }
};

const datasourceTempEnfermedades = {
    "detailImageRightData": {
        "type": "object",
        "objectId": "detailImageRightSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://images.unsplash.com/photo-1588421357574-87938a86fa28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
                    "size": "large"
                }
            ]
        },
        "title": "Recomendaciones",
        "subtitle": "Cuidados para la salud",
        "image": {
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

const datasourceTempClinicas = {
    "detailImageRightData": {
        "type": "object",
        "objectId": "detailImageRightSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://images.unsplash.com/photo-1588421357574-87938a86fa28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
                    "size": "large"
                }
            ]
        },
        "title": "",
        "subtitle": "Huejutla",
        "image": {
            "contentDescription": "",
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "",
                    "size": "large"
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": ""
            },
            "rating": {
                "number": 4,
                "text": "268"
            },
            "locationText": {
                "type": "PlainText",
                "text": ""
            },
            "secondaryText": {
                "type": "PlainText",
                "text": ""
            }
        },
        "buttons": [
            {
                "text": ""
            },
            {
                "text": ""
            }
        ]
    }
};

const datasourceTempCancel = {
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
                        "url": "https://i.pinimg.com/originals/fa/59/71/fa59718b21cb5ceebbfa5fbfcea25471.gif",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Hasta pronto"
                },
                "secondaryText": {
                    "type": "PlainText",
                    "text": "Hasta pronto"
                }
            },
            "logoUrl": "https://github.com/SergioooAGS/ProyE/blob/main/REMASTER.png?raw=true",
            "hintText": "Le deseamos un buen dia!",
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
    datasourceIndex,
    datasourceCatalogo,
    datasourceTempEnfermedades,
    datasourceTempClinicas,
    datasourceTempCancel
    
}