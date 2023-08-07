/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const { datasourceAutos } = require('./dataSourses');
const { datasourceInfo } = require('./dataSourses');

const DOCUMENT_InfoTemp = "datos_Template";
const DOCUMENT_CarrosTemp = "carros_Template";

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
    const tableName = 'carrosClasicos_table';
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
        
        const IntentPresupuesto = sessionAttributes['IntentPresupuesto'];
        const IntentAntiguedad = sessionAttributes['IntentAntiguedad'];
        const IntentAntiguedadName = sessionAttributes['IntentAntiguedadName'];
        
        datasourceAutos.detailImageRightData.image.sources[0].url = "https://i.pinimg.com/1200x/dc/0f/73/dc0f73f6b68a183d94bc742cf83fcde0.jpg"
        datasourceAutos.detailImageRightData.textContent.primaryText.text = requestAttributes.t('RECOMENDACION_PRIMARY_MSG')
        datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('RECOMENDACION_LOCATION_MSG')
        datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('RECOMENDACION_SECONDARY_MSG')
        
        let speechText = requestAttributes.t('WELCOME_MSG');
        
        if(IntentPresupuesto && IntentAntiguedadName && IntentAntiguedad){
            if(IntentAntiguedadName === "clasicos"){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://www.tallerautomotrizgm.com/wp-content/uploads/2022/11/Autos-Clasicos-.jpg"
                datasourceAutos.detailImageRightData.textContent.primaryText.text = requestAttributes.t('CLASIC_PRIMARY_MSG')
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('CLASIC_LOCATION_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CLASIC_SECONDARY_MSG')
            }
            else if(IntentAntiguedadName === "modernos"){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://img.remediosdigitales.com/79c1cb/porsche_1/840_560.jpg"
                datasourceAutos.detailImageRightData.textContent.primaryText.text = requestAttributes.t('MODERN_PRIMARY_MSG')
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('MODERN_LOCATION_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('MODERN_SECONDARY_MSG')
            }
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_CarrosTemp, datasourceAutos);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            } 
            speechText = requestAttributes.t('REGISTER_MSG', IntentPresupuesto, IntentAntiguedadName)
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_CarrosTemp, datasourceAutos);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        } 
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const RegisterDatosIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterDatosIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;

        const IntentPresupuesto = intent.slots.IntentPresupuesto.value;
        const IntentAntiguedad = intent.slots.IntentAntiguedad.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const IntentAntiguedadName = intent.slots.IntentAntiguedad.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        sessionAttributes['IntentPresupuesto'] = IntentPresupuesto;
        sessionAttributes['IntentAntiguedad'] = IntentAntiguedad;
        sessionAttributes['IntentAntiguedadName'] = IntentAntiguedadName;
        
        if(IntentAntiguedadName === "clasicos" || IntentAntiguedadName === "classic"){
            datasourceAutos.detailImageRightData.image.sources[0].url = "https://www.tallerautomotrizgm.com/wp-content/uploads/2022/11/Autos-Clasicos-.jpg"
            datasourceAutos.detailImageRightData.textContent.primaryText.text = requestAttributes.t('CLASIC_PRIMARY_MSG')
            datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('CLASIC_LOCATION_MSG')
            datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CLASIC_SECONDARY_MSG')
        }
        else if(IntentAntiguedadName === "modernos" || IntentAntiguedadName === "modern"){
            datasourceAutos.detailImageRightData.image.sources[0].url = "https://img.remediosdigitales.com/79c1cb/porsche_1/840_560.jpg"
            datasourceAutos.detailImageRightData.textContent.primaryText.text = requestAttributes.t('MODERN_PRIMARY_MSG')
            datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('MODERN_LOCATION_MSG')
            datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('MODERN_SECONDARY_MSG')
        }
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_CarrosTemp, datasourceAutos);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('REGISTER_MSG', IntentPresupuesto, IntentAntiguedadName) + requestAttributes.t('HELP_MSG'))
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const SayRecomendacionesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SayRecomendacionesIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const IntentPresupuesto = sessionAttributes['IntentPresupuesto'];
        const IntentAntiguedad = sessionAttributes['IntentAntiguedad'];
        const IntentAntiguedadName = sessionAttributes['IntentAntiguedadName'];
        
        const precioCorolla = 100000;
        const precioSkyline = 150000;
        const precioLancer = 65000;
        const precioChallenger = 89600;
        const precioCamaro = 60000;
        const precioSupra = 85000;
        
        let speechText;
        
        if(IntentAntiguedadName === "clasicos" || IntentAntiguedadName === "classic"){
            const numeroAleatorio = Math.floor(Math.random() * 3) + 1;
            
            if(numeroAleatorio === 1){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://i.pinimg.com/originals/70/d2/57/70d2578a532e75638aea2e9bbc132905.jpg"
                
                datasourceAutos.detailImageRightData.textContent.primaryText.text = "Toyota Corolla AE86"
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('COROLLA_LOCAL_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('COROLLA_SECON_MSG')
                
                if (IntentPresupuesto >= precioCorolla){
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRASI_MSG', precioCorolla, IntentPresupuesto);
                }
                else{
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRANO_MSG', precioCorolla, IntentPresupuesto);
                }
            }
            else if(numeroAleatorio === 2){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://i.pinimg.com/originals/c2/f2/90/c2f29099d0e78e9b59c3e8b5338dccef.jpg"
                
                datasourceAutos.detailImageRightData.textContent.primaryText.text = "Nissan Skyline R34"
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('SKYLINE_LOCAL_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('SKYLINE_SECON_MSG')
                
                if (IntentPresupuesto >= precioSkyline){
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRASI_MSG', precioSkyline, IntentPresupuesto);
                }
                else{
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRANO_MSG', precioSkyline, IntentPresupuesto);
                }
            }
            else if(numeroAleatorio === 3){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://e0.pxfuel.com/wallpapers/580/941/desktop-wallpaper-mitsubishi-lancer-evolution-mitsubishi-lancer-evo-5.jpg"
                
                datasourceAutos.detailImageRightData.textContent.primaryText.text = "Mitsubishi Lancer Evo 5"
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('EVO_LOCAL_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('EVO_SECON_MSG')
                
                if (IntentPresupuesto >= precioLancer){
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRASI_MSG', precioLancer, IntentPresupuesto);
                }
                else{
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRANO_MSG', precioLancer, IntentPresupuesto);
                }
            }
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_CarrosTemp, datasourceAutos);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }        
        }
        else if(IntentAntiguedadName === "modernos" || IntentAntiguedadName === "modern"){
            speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName);
            const numeroAleatorio = Math.floor(Math.random() * 3) + 1;
            if(numeroAleatorio === 1){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_6213c932dec740f39d8d5b522fc74eae.jpg"
                
                datasourceAutos.detailImageRightData.textContent.primaryText.text = "Dodge challenger 2020"
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('DODGE_LOCAL_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('DODGE_SECON_MSG')
                
                if (IntentPresupuesto >= precioChallenger){
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRASI_MSG', precioChallenger, IntentPresupuesto);
                }
                else{
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRANO_MSG', precioChallenger, IntentPresupuesto);
                }
            }
            else if(numeroAleatorio === 2){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://hips.hearstapps.com/es.h-cdn.co/cades/contenidos/47760/2018-chevrolet-camaro-zl1-1le-104-1.jpg"
                
                datasourceAutos.detailImageRightData.textContent.primaryText.text = "Chevrolet Camaro Zl1"
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('CAMARO_LOCAL_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('CAMARO_SECON_MSG')
                
                if (IntentPresupuesto >= precioCamaro){
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRASI_MSG', precioCamaro, IntentPresupuesto);
                }
                else{
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRANO_MSG', precioCamaro, IntentPresupuesto);
                }
            }
            else if(numeroAleatorio === 3){
                datasourceAutos.detailImageRightData.image.sources[0].url = "https://img.remediosdigitales.com/377e21/2023_supra_mt_3.0_mattewhite_002/450_1000.jpg"
                
                datasourceAutos.detailImageRightData.textContent.primaryText.text = "Toyota Supra mk5"
                datasourceAutos.detailImageRightData.textContent.locationText.text = requestAttributes.t('SUPRA_LOCAL_MSG')
                datasourceAutos.detailImageRightData.textContent.secondaryText.text = requestAttributes.t('SUPRA_SECON_MSG')
                
                if (IntentPresupuesto >= precioSupra){
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRASI_MSG', precioSupra, IntentPresupuesto);
                }
                else{
                    speechText = requestAttributes.t('RECOMEN_MSG', IntentAntiguedadName) + requestAttributes.t('COMPRANO_MSG', precioSupra, IntentPresupuesto);
                }
            }
        }
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_CarrosTemp, datasourceAutos);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
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

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP2_MSG');
        
        datasourceInfo.headlineTemplateData.properties.textContent.primaryText.text = requestAttributes.t('HELP_MSG')
        datasourceInfo.headlineTemplateData.properties.hintText = requestAttributes.t('HELP_TEMP_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_InfoTemp, datasourceInfo);
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

        datasourceInfo.headlineTemplateData.properties.textContent.primaryText.text = requestAttributes.t('DESPEDIDA_MSG')
        datasourceInfo.headlineTemplateData.properties.hintText = requestAttributes.t('DESPEDIDA2_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_InfoTemp, datasourceInfo);
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
        
        datasourceInfo.headlineTemplateData.properties.textContent.primaryText.text = requestAttributes.t('FALLBACKPRIMARY_MSG')
        datasourceInfo.headlineTemplateData.properties.hintText = requestAttributes.t('FALLBACKHIND_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_InfoTemp, datasourceInfo);
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
        
        datasourceInfo.headlineTemplateData.properties.textContent.primaryText.text = requestAttributes.t('ERRORPRIMARY_MSG')
        datasourceInfo.headlineTemplateData.properties.hintText = requestAttributes.t('ERRORHIND_MSG')
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_InfoTemp, datasourceInfo);
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
        RegisterDatosIntentHandler,
        SayRecomendacionesIntentHandler,
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