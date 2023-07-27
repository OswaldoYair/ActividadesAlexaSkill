/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios');
const https = require('https');

const { datasourceIndex } = require('./dataSourses');
const { datasourceCatalogo } = require('./dataSourses');
const { datasourceTempEnfermedades } = require('./dataSourses');
const { datasourceTempClinicas } = require('./dataSourses');
const { datasourceTempCancel } = require('./dataSourses');

const DOCUMENT_01 = "inicioSS";
const DOCUMENT_tempCatalogo = "catalogo_Template";
const DOCUMENT_tempEnfermedades = "enfermedades_Template";
const DOCUMENT_tempClinicas = "clinicas_Template";
const DOCUMENT_tempCancel = "cancel_Template";

var persistenceAdapter = getPersistenceAdapter();

const moment = require('moment-timezone');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = require('./localization');

function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'proyectoSkill_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const enfermedadSeleccionada = sessionAttributes['enfermedadName'];
        
        let speechText = requestAttributes.t('WELCOME_MSG');
        
        datasourceCatalogo.textListData.listItems[0].primaryText = requestAttributes.t('ARTRITIS_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[1].primaryText = requestAttributes.t('DIABETES_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[2].primaryText = requestAttributes.t('COLESTEROL_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[3].primaryText = requestAttributes.t('HIPERTENSION_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[4].primaryText = requestAttributes.t('INSUFICIENCIA_MSG_primaryText');
        
        if(enfermedadSeleccionada){
            speechText = requestAttributes.t('REGISTER_MSG', enfermedadSeleccionada + requestAttributes.t('CATALOGO_MSG'))
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_tempCatalogo, datasourceCatalogo);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_01, datasourceIndex);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const RegisterEnfermedadIntentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterEnfermedadIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        const enfermedadId = intent.slots.IntentEnfermedad.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const enfermedadName = intent.slots.IntentEnfermedad.resolutions.resolutionsPerAuthority[0].values[0].value.name
        
        sessionAttributes['enfermedadId'] = enfermedadId;
        sessionAttributes['enfermedadName'] = enfermedadName;
        
        if(enfermedadName === "diabetes"){
            datasourceTempEnfermedades.detailImageRightData.image.sources[0].url = requestAttributes.t('DIABETES_IMG')
            datasourceTempEnfermedades.detailImageRightData.textContent.primaryText.text = requestAttributes.t('DIABETES_MSG_primaryText')
            datasourceTempEnfermedades.detailImageRightData.textContent.locationText.text = requestAttributes.t('DIABETES_MSG_locationText')
            datasourceTempEnfermedades.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('DIABETES_MSG_secondaryText')
        }
        else if(enfermedadName === "hipertension" || enfermedadName === "hypertension"){
            datasourceTempEnfermedades.detailImageRightData.image.sources[0].url = requestAttributes.t('HIPERTENSION_IMG')
            datasourceTempEnfermedades.detailImageRightData.textContent.primaryText.text = requestAttributes.t('HIPERTENSION_MSG_primaryText')
            datasourceTempEnfermedades.detailImageRightData.textContent.locationText.text = requestAttributes.t('HIPERTENSION_MSG_locationText')
            datasourceTempEnfermedades.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('HIPERTENSION_MSG_secondaryText')
        }
        else if(enfermedadName === "artritis" || enfermedadName === "arthritis"){
            datasourceTempEnfermedades.detailImageRightData.image.sources[0].url = requestAttributes.t('ARTRITIS_IMG')
            datasourceTempEnfermedades.detailImageRightData.textContent.primaryText.text = requestAttributes.t('ARTRITIS_MSG_primaryText')
            datasourceTempEnfermedades.detailImageRightData.textContent.locationText.text = requestAttributes.t('ARTRITIS_MSG_locationText')
            datasourceTempEnfermedades.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('ARTRITIS_MSG_secondaryText')
        }
        else if(enfermedadName === "colesterol" || enfermedadName === "cholesterol"){
            datasourceTempEnfermedades.detailImageRightData.image.sources[0].url = requestAttributes.t('COLESTEROL_IMG')
            datasourceTempEnfermedades.detailImageRightData.textContent.primaryText.text = requestAttributes.t('COLESTEROL_MSG_primaryText')
            datasourceTempEnfermedades.detailImageRightData.textContent.locationText.text = requestAttributes.t('COLESTEROL_MSG_locationText')
            datasourceTempEnfermedades.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('COLESTEROL_MSG_secondaryText')
        }
        else if(enfermedadName === "insuficiencia cardiaca" || enfermedadName === "heart failure"){
            datasourceTempEnfermedades.detailImageRightData.image.sources[0].url = requestAttributes.t('INSUFICIENCIA_IMG')
            datasourceTempEnfermedades.detailImageRightData.textContent.primaryText.text = requestAttributes.t('INSUFICIENCIA_MSG_primaryText')
            datasourceTempEnfermedades.detailImageRightData.textContent.locationText.text = requestAttributes.t('INSUFICIENCIA_MSG_locationText')
            datasourceTempEnfermedades.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('INSUFICIENCIA_MSG_secondaryText')
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_tempEnfermedades, datasourceTempEnfermedades);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('REGISTER_MSG', enfermedadName) + requestAttributes.t('HELP_MSG'))
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const SayClinicasIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SayClinicasIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const enfermedadSeleccionada = sessionAttributes['enfermedadName'];
        
        let speechText;
        
        if(enfermedadSeleccionada){
            if(enfermedadSeleccionada === "diabetes"){
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('VITE_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('VITE_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('VITE_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 4
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = requestAttributes.t('VITE_MSG_locationText')
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('VITE_MSG_secondaryText')
                datasourceTempClinicas.detailImageRightData.buttons[0].text = requestAttributes.t('VITE_BUTTON1')
                datasourceTempClinicas.detailImageRightData.buttons[1].text = requestAttributes.t('VITE_BUTTON2')
            }
            else if(enfermedadSeleccionada === "hipertension" || enfermedadSeleccionada === "hypertension"){
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('CLIHUEJUTLA_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('CLIHUEJUTLA_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('CLIHUEJUTLA_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 3
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = requestAttributes.t('CLIHUEJUTLA_MSG_locationText')
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CLIHUEJUTLA_MSG_secondaryText')
                datasourceTempClinicas.detailImageRightData.buttons[0].text = requestAttributes.t('CLIHUEJUTLA_BUTTON1')
                datasourceTempClinicas.detailImageRightData.buttons[1].text = requestAttributes.t('CLIHUEJUTLA_BUTTON2')
            }
            else if(enfermedadSeleccionada === "artritis" || enfermedadSeleccionada === "arthritis"){
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('BETANIA_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('BETANIA_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('BETANIA_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 5
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = requestAttributes.t('BETANIA_MSG_locationText')
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('BETANIA_MSG_secondaryText')
                datasourceTempClinicas.detailImageRightData.buttons[0].text = requestAttributes.t('BETANIA_BUTTON1')
                datasourceTempClinicas.detailImageRightData.buttons[1].text = requestAttributes.t('BETANIA_BUTTON2')
            }
            else if(enfermedadSeleccionada === "colesterol" || enfermedadSeleccionada === "cholesterol"){
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('MEDICA21_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('MEDICA21_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('MEDICA21_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 4
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = requestAttributes.t('MEDICA21_locationText')
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('MEDICA21_MSG_secondaryText')
                datasourceTempClinicas.detailImageRightData.buttons[0].text = requestAttributes.t('MEDICA21_BUTTON1')
                datasourceTempClinicas.detailImageRightData.buttons[1].text = requestAttributes.t('MEDICA21_BUTTON2')
            }
            else if(enfermedadSeleccionada === "insuficiencia cardiaca" || enfermedadSeleccionada === "heart failure"){
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('CIGO_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('CIGO_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('CIGO_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 4
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = requestAttributes.t('CIGO_locationText')
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CIGO_MSG_secondaryText')
                datasourceTempClinicas.detailImageRightData.buttons[0].text = requestAttributes.t('CIGO_BUTTON1')
                datasourceTempClinicas.detailImageRightData.buttons[1].text = requestAttributes.t('CIGO_BUTTON2')
            }
            
            speechText = requestAttributes.t('RECOMEN_MSG', enfermedadSeleccionada);
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_tempClinicas, datasourceTempClinicas);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
        }
        else {
            speechText = requestAttributes.t('MISSING_MSG');
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const SayLocationClinicasIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SayLocationClinicasIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const enfermedadSeleccionada = sessionAttributes['enfermedadName'];
        
        const apiKey = 'pk.eyJ1Ijoib3N3YWxkbzEiLCJhIjoiY2xrYjhnc241MGMzbTNlcW50ZHR3czV0YSJ9.QQTgfCmlnp43oDtHYxJf2w';
        let address;
        let speechText;
        
        async function getAddressFromMapbox(locationName) {
          const apiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
          const url = `${apiUrl}${encodeURIComponent(locationName)}.json?access_token=${apiKey}`;
          try {
            const response = await axios.get(url)
            const feature = response.data.features[0];
            
            if (feature && feature.place_name) {
              address = feature.place_name; // Asignar la dirección a la variable global
            } else {
              console.log('La respuesta de Mapbox no contiene datos válidos.');
            }
          } catch (error) {
            console.error('Error al obtener la dirección desde Mapbox:', error.message);
          }
        }
  
        if(enfermedadSeleccionada){
            if(enfermedadSeleccionada === "diabetes"){
                const locationName = 'Calle Cuauhtémoc 18, 43000 Huejutla de Reyes, Hidalgo, México';
                await getAddressFromMapbox(locationName)
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('VITE_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('VITE_LOCATION_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('VITE_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 4
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = address
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('VITE_MSG_secondaryText')
            }
            else if(enfermedadSeleccionada === "hipertension" || enfermedadSeleccionada === "hypertension"){
                const locationName = 'Clinica Huejutla, Huejutla de Reyes, Hidalgo 43000, México';
                await getAddressFromMapbox(locationName)
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('CLIHUEJUTLA_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('CLIHUEJUTLA_LOCATION_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('CLIHUEJUTLA_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 3
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = address
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CLIHUEJUTLA_MSG_secondaryText')
            }
            else if(enfermedadSeleccionada === "artritis" || enfermedadSeleccionada === "arthritis"){
                const locationName = 'Allende 444, Tahuizan, 43000 Huejutla, Hgo.';
                await getAddressFromMapbox(locationName)
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('BETANIA_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('BETANIA_LOCATION_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('BETANIA_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 5
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = address
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('BETANIA_MSG_secondaryText')
            }
            else if(enfermedadSeleccionada === "colesterol" || enfermedadSeleccionada === "cholesterol"){
                const locationName = 'Avenida Juárez 57, 43000 Huejutla de Reyes';
                await getAddressFromMapbox(locationName)
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('MEDICA21_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('MEDICA21_LOCATION_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('MEDICA21_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 4
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = address
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('MEDICA21_MSG_secondaryText')
            }
            else if(enfermedadSeleccionada === "insuficiencia cardiaca" || enfermedadSeleccionada === "heart failure"){
                const locationName = 'Calle Cuauhtémoc 18, 43000 Huejutla de Reyes, Hidalgo, México';
                await getAddressFromMapbox(locationName)
                datasourceTempClinicas.detailImageRightData.title = requestAttributes.t('CIGO_TITLE')
                datasourceTempClinicas.detailImageRightData.image.sources[0].url = requestAttributes.t('CIGO_LOCATION_IMG')
                datasourceTempClinicas.detailImageRightData.textContent.primaryText.text = requestAttributes.t('CIGO_MSG_primaryText')
                datasourceTempClinicas.detailImageRightData.textContent.rating.number = 4
                datasourceTempClinicas.detailImageRightData.textContent.locationText.text = requestAttributes.t('CIGO_locationText')
                datasourceTempClinicas.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CIGO_MSG_secondaryText')
            }
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_tempClinicas, datasourceTempClinicas);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
        }
        else {
            speechText = requestAttributes.t('MISSING_MSG');
        }
        
        speechText = requestAttributes.t('LOCALIZATION_MSG', address);
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP_MSG');

        datasourceCatalogo.textListData.listItems[0].primaryText = requestAttributes.t('ARTRITIS_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[1].primaryText = requestAttributes.t('DIABETES_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[2].primaryText = requestAttributes.t('COLESTEROL_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[3].primaryText = requestAttributes.t('HIPERTENSION_MSG_primaryText');
        datasourceCatalogo.textListData.listItems[4].primaryText = requestAttributes.t('INSUFICIENCIA_MSG_primaryText');
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_tempCatalogo, datasourceCatalogo);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('GOODBYE_MSG');
        
        datasourceTempCancel.headlineTemplateData.textContent.primaryText = requestAttributes.t('DESPEDIDA_MSG')
        datasourceTempCancel.headlineTemplateData.textContent.secondaryText = requestAttributes.t('DESPEDIDA_MSG')
        datasourceTempCancel.headlineTemplateData.hintText = requestAttributes.t('DESPEDIDA2_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_tempCancel, datasourceTempCancel);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('FALLBACK_MSG');
        
        datasourceTempCancel.headlineTemplateData.textContent.primaryText = requestAttributes.t('FALLBACKPRIMARY_MSG')
        datasourceTempCancel.headlineTemplateData.textContent.secondaryText = requestAttributes.t('FALLBACKSECONDARY_MSG')
        datasourceTempCancel.headlineTemplateData.hintText = requestAttributes.t('FALLBACKHIND_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_tempCancel, datasourceTempCancel);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MSG');
        
        datasourceTempCancel.headlineTemplateData.textContent.primaryText = requestAttributes.t('ERRORPRIMARY_MSG')
        datasourceTempCancel.headlineTemplateData.textContent.secondaryText = requestAttributes.t('ERRORSECONDARY_MSG')
        datasourceTempCancel.headlineTemplateData.hintText = requestAttributes.t('ERRORHIND_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_tempCancel, datasourceTempCancel);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationRequestInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterEnfermedadIntentIntentHandler,
        SayClinicasIntentHandler,
        SayLocationClinicasIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationRequestInterceptor,
        LoggingRequestInterceptor,
        LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();