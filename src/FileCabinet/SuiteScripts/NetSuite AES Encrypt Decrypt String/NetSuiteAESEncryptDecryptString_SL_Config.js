/**
 * @NApiVersion 2.1
 */
define([],

    () => {

        const PARAMETERS = {
            APP: {},
            SCRIPT_PARAMETERS: {},
            SUITELET: {
                FIELDS: {},
                BUTTONS: {}
            }
        };

        // App
        PARAMETERS.APP.NAME = 'NetSuite AES Encrypt Decrypt SL';

        // Suitelet / GET
        PARAMETERS.SUITELET.FIELDS.ENCRYPTION = {
            ID: 'custpage_encryption',
            LABEL: 'Encryption:'
        }

        PARAMETERS.SUITELET.FIELDS.ENCRYPT = {
            ID: 'custpage_encrypt',
            LABEL: 'Encrypt / Decrypt'
        }

        PARAMETERS.SUITELET.FIELDS.PASSPHRASE = {
            ID: 'custpage_passphrase',
            LABEL: 'Passphrase:'
        }

        PARAMETERS.SUITELET.FIELDS.STRING = {
            ID: 'custpage_string',
            LABEL: 'String (to Encrypt / Decrypt):'
        };

        PARAMETERS.SUITELET.FIELDS.RESULT = {
            ID: 'custpage_result',
            LABEL: 'Result:'
        }

        PARAMETERS.SUITELET.BUTTONS.ENCRYPT_DECRYPT = {
            LABEL: 'Encrypt / Decrypt'
        }

        PARAMETERS.SUITELET.BUTTONS.COPY_RESULT_TO_CLIPBOARD = {
            ID: 'custpage_copy_result_to_clipboard',
            LABEL: 'Copy Result to Clipboard'
        }

        PARAMETERS.SUITELET.BUTTONS.COPY_RESULT_TO_STRING = {
            ID: 'custpage_copy_result_to_string',
            LABEL: 'Copy Result to String'
        }

        return PARAMETERS;

    });
