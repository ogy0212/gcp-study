const fs = require("fs");

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const language = require('@google-cloud/language');

// Creates a client
const visionClient = new vision.ImageAnnotatorClient();
const languageClient = new language.LanguageServiceClient();

// Performs label detection on the image file
visionClient
    .documentTextDetection('./images/me.jpg')
    .then(textDetectionResults => {
        console.log('Extracted Text:');
        console.log(textDetectionResults[0].fullTextAnnotation.text);
        return textDetectionResults[0].fullTextAnnotation.text;
    })
    .then(text => {
        return languageClient
            .analyzeEntities({
                document: {
                    content: text,
                    type: 'PLAIN_TEXT',
                },
            })
    })
    .then(languageResults => {
        console.log('languageResults:');
        console.log(languageResults);
        const result = {
            person: [],
            organization: [],
            phoneNumber: [],
            address: [],
        }
        languageResults[0].entities.forEach(entity => {
            switch (entity.type) {
                case 'PERSON':
                    result.person.push(entity.name);
                    break;

                case 'ORGANIZATION':
                    result.organization.push(entity.name);
                    break;

                case 'PHONE_NUMBER':
                    result.phoneNumber.push(entity.name);
                    break;

                case 'ADDRESS':
                    result.address.push(entity.name);
                    break;

                default:
                    break;
            }
            console.log(`${entity.name},${entity.type}`);
        });
        console.log(JSON.stringify(result));
        // fs.writeFileSync("result.json", JSON.stringify(languageResults));
    })
    .catch(err => {
        console.error('ERROR:', err);
    });