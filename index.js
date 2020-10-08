const Alexa = require("ask-sdk-core");

const SKILL_NAME = "trece";
const GET_FACT_MESSAGE = "aki las ten go pa keeh meeh las bezeh ";

const CONTINUE_REPROMPT = "Again?";
const REPEAT_MESSAGE = "Seezas, here it is... ";

const CANT_REPEAT_PROMPT = "cannot repeat, learn to talk";
const CANT_REPEAT_REPROMPT = " really again?";

const HELP_REPROMPT = "fucker";
const HELP_MESSAGE = "welcome fucker";

const FALLBACK_REPROMPT = "fallback";
const FALLBACK_MESSAGE = "fallback message";

const STOP_MESSAGE = "stop bitch";
const ERROR_MESSAGE = "error in the A.P.I, learn to code fucking Jason";

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE + HELP_REPROMPT)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE + FALLBACK_REPROMPT)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent" ||
        request.intent.name === "AMAZON.NoIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(STOP_MESSAGE).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder.speak(ERROR_MESSAGE).getResponse();
  },
};

const GetNewFactHandler = {
  canHandle({ requestEnvelope }) {
    const { request } = requestEnvelope;
    return (
      request.type === "LaunchRequest" ||
      (request.type === "IntentRequest" &&
        request.intent.name === "HelloWorldIntent")
    );
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    let sessionAttributes = attributesManager.getSessionAttributes();
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(GET_FACT_MESSAGE)
      .withSimpleCard(SKILL_NAME, GET_FACT_MESSAGE)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const GetHolaMundoHandler = {
  canHandle({ requestEnvelope }) {
    const { request } = requestEnvelope;
    return (
      request.type === "LaunchRequest" ||
      (request.type === "IntentRequest" &&
        request.intent.name === "HolaMundoIntent")
    );
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    let sessionAttributes = attributesManager.getSessionAttributes();
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak("aqui las tengo para que me las besé")
      .withSimpleCard(SKILL_NAME, "aqui las tengo para que me las besé")
      .withShouldEndSession(true)
      .getResponse();
  },
};

let skill;

exports.handler = async (event, context) => {
  console.log("REQUEST", JSON.stringify(event));
  const { locale } = event.request;

  if (!skill) {
    if (locale === "es-US") {
      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
          GetHolaMundoHandler,
          RepeatHandler,
          HelpHandler,
          FallbackHandler,
          CancelAndStopIntentHandler,
          SessionEndedRequestHandler
        )
        .addErrorHandlers(ErrorHandler)
        .create();
    } else {
      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
          GetNewFactHandler,
          RepeatHandler,
          HelpHandler,
          FallbackHandler,
          CancelAndStopIntentHandler,
          SessionEndedRequestHandler
        )
        .addErrorHandlers(ErrorHandler)
        .create();
    }
  }

  const response = await skill.invoke(event, context);
  console.log("RESPONSE", JSON.stringify(response));
  return response;
};
