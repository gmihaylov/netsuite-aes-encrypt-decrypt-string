/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
        'N/ui/serverWidget',
        './NetSuiteAESEncryptDecryptString_SL_Config',
        './lib/crypto-js',
        'N/log'
    ],

    (
        ui,
        CONFIG,
        CryptoJS,
        log
    ) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                const getForm = mainForm();
                scriptContext.response.writePage(getForm);
            }

            if (scriptContext.request.method === 'POST') {
                const postParameters = getPostParameters(scriptContext);
                const postForm = mainForm();
                updatePostForm(postForm, postParameters);
                scriptContext.response.writePage(postForm);
            }
        }

        const mainForm = () => {
            const form = ui.createForm({
                title: CONFIG.APP.NAME,
                hideNavBar: false
            });

            form.clientScriptModulePath = './NetSuiteAESEncryptDecryptString_CS';

            const encryptionFld = form.addField({
                id: CONFIG.SUITELET.FIELDS.ENCRYPTION.ID,
                type: ui.FieldType.SELECT,
                label: CONFIG.SUITELET.FIELDS.ENCRYPTION.LABEL
            }).updateDisplayType({
                displayType : ui.FieldDisplayType.INLINE
            }).updateBreakType({
                breakType: ui.FieldBreakType.STARTCOL
            });
            addEncryptionSelectOptions(encryptionFld);

            const passphraseFld = form.addField({
                id: CONFIG.SUITELET.FIELDS.PASSPHRASE.ID,
                type: ui.FieldType.TEXT,
                label: CONFIG.SUITELET.FIELDS.PASSPHRASE.LABEL
            }).updateBreakType({
                breakType: ui.FieldBreakType.STARTROW
            });
            passphraseFld.isMandatory = true;

            const encryptFld = form.addField({
                id: CONFIG.SUITELET.FIELDS.ENCRYPT.ID,
                label: 'Encrypt',
                type: ui.FieldType.RADIO,
                source: 'encrypt'
            });

            const decryptFld = form.addField({
                id: CONFIG.SUITELET.FIELDS.ENCRYPT.ID,
                label: 'Decrypt',
                type: ui.FieldType.RADIO,
                source: 'decrypt'
            });
            decryptFld.defaultValue = 'encrypt';

            const stringFld = form.addField({
                id: CONFIG.SUITELET.FIELDS.STRING.ID,
                type: ui.FieldType.TEXTAREA,
                label: CONFIG.SUITELET.FIELDS.STRING.LABEL
            }).updateBreakType({
                breakType: ui.FieldBreakType.STARTCOL
            }).updateDisplaySize({
                height: 10,
                width: 60,
            });
            stringFld.isMandatory = true;

            const resultFld = form.addField({
                id: CONFIG.SUITELET.FIELDS.RESULT.ID,
                type: ui.FieldType.TEXTAREA,
                label: CONFIG.SUITELET.FIELDS.RESULT.LABEL
            }).updateBreakType({
                breakType: ui.FieldBreakType.STARTCOL
            }).updateDisplaySize({
                height: 10,
                width: 60,
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.READONLY
            });


            form.addSubmitButton(CONFIG.SUITELET.BUTTONS.ENCRYPT_DECRYPT.LABEL);
            form.addButton({
                id: CONFIG.SUITELET.BUTTONS.COPY_RESULT_TO_CLIPBOARD.ID,
                label: CONFIG.SUITELET.BUTTONS.COPY_RESULT_TO_CLIPBOARD.LABEL,
                functionName: 'copyClipboard()'
            });
            form.addButton({
                id: CONFIG.SUITELET.BUTTONS.COPY_RESULT_TO_STRING.ID,
                label: CONFIG.SUITELET.BUTTONS.COPY_RESULT_TO_STRING.LABEL,
                functionName: 'copyResultString()'
            });

            return form;
        }

        const updatePostForm = (form, parameters) => {
            const encryptionFld = form.getField(CONFIG.SUITELET.FIELDS.ENCRYPTION.ID);
            encryptionFld.defaultValue = parameters[CONFIG.SUITELET.FIELDS.ENCRYPTION.ID];

            const passphraseFld = form.getField(CONFIG.SUITELET.FIELDS.PASSPHRASE.ID);
            passphraseFld.defaultValue = parameters[CONFIG.SUITELET.FIELDS.PASSPHRASE.ID];

            const stringFld = form.getField(CONFIG.SUITELET.FIELDS.STRING.ID);
            stringFld.defaultValue = parameters[CONFIG.SUITELET.FIELDS.STRING.ID];

            const encryptFld = form.getField(CONFIG.SUITELET.FIELDS.ENCRYPT.ID);
            encryptFld.defaultValue = parameters[CONFIG.SUITELET.FIELDS.ENCRYPT.ID];

            const resultFld = form.getField(CONFIG.SUITELET.FIELDS.RESULT.ID);

            if(parameters[CONFIG.SUITELET.FIELDS.ENCRYPT.ID] === 'encrypt') {
                const encryptedString = encrypt(
                    parameters[CONFIG.SUITELET.FIELDS.ENCRYPTION.ID],
                    parameters[CONFIG.SUITELET.FIELDS.STRING.ID],
                    parameters[CONFIG.SUITELET.FIELDS.PASSPHRASE.ID]
                );
                resultFld.defaultValue = encryptedString.toString();
            }

            if(parameters[CONFIG.SUITELET.FIELDS.ENCRYPT.ID] === 'decrypt') {
                const decryptedString = decrypt(
                    parameters[CONFIG.SUITELET.FIELDS.ENCRYPTION.ID],
                    parameters[CONFIG.SUITELET.FIELDS.STRING.ID],
                    parameters[CONFIG.SUITELET.FIELDS.PASSPHRASE.ID]
                );
                resultFld.defaultValue = decryptedString.toString();
            }
        }

        const encrypt = (encryption, string, passphrase) => {
            switch (encryption) {
                case 'aes':
                    return CryptoJS.AES.encrypt(string, passphrase.toString());
                default:
                    return '';
            }
        }

        const decrypt = (encryption, string, passphrase) => {
            switch (encryption) {
                case 'aes':
                    return CryptoJS.AES.decrypt(string, passphrase).toString(CryptoJS.enc.Utf8);
                default:
                    return '';
            }
        }

        const getPostParameters = (scriptContext) => {
            const parameters = {};
            const requestParameters = scriptContext.request.parameters;

            parameters[CONFIG.SUITELET.FIELDS.ENCRYPTION.ID] = requestParameters[CONFIG.SUITELET.FIELDS.ENCRYPTION.ID];
            parameters[CONFIG.SUITELET.FIELDS.PASSPHRASE.ID] = requestParameters[CONFIG.SUITELET.FIELDS.PASSPHRASE.ID];
            parameters[CONFIG.SUITELET.FIELDS.STRING.ID] = requestParameters[CONFIG.SUITELET.FIELDS.STRING.ID];
            parameters[CONFIG.SUITELET.FIELDS.ENCRYPT.ID] = requestParameters[CONFIG.SUITELET.FIELDS.ENCRYPT.ID];

            log.debug({
                title: CONFIG.APP.NAME,
                details: `POST Parameters: ${JSON.stringify(parameters)}`
            })

            return parameters;
        }

        const addEncryptionSelectOptions = (encryptionFld) => {
            encryptionFld.addSelectOption({
                value: 'aes',
                text: 'AES',
                isSelected: true
            });

            return encryptionFld;
        }


        return {onRequest}

    });
