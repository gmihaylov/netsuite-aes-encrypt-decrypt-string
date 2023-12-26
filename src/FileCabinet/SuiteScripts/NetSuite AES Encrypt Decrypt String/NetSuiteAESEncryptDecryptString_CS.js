/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord'],

function(currentRecord) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        return true;
    }

    function copyClipboard() {
        var record = currentRecord.get();

        var resultFldValue = record.getValue({
            fieldId: 'custpage_result'
        })

        navigator.clipboard.writeText(resultFldValue).then(function() {
            alert('Copying to clipboard was successful!');
        }, function(err) {
            alert('Could not copy text: ', err);
        });
    }

    function copyResultString() {
        var record = currentRecord.get();

        var resultFldValue = record.getValue({
            fieldId: 'custpage_result'
        });

        if(!resultFldValue) return;

        var encryptFldValue = record.getValue({
            fieldId: 'custpage_encrypt'
        });

        record.setValue({
            fieldId: 'custpage_string',
            value: resultFldValue
        })

        record.setValue({
            fieldId: 'custpage_result',
            value: null
        });

        if(encryptFldValue === 'encrypt') {
            record.setValue({
                fieldId: 'custpage_encrypt',
                value: 'decrypt'
            })
        } else {
            record.setValue({
                fieldId: 'custpage_encrypt',
                value: 'encrypt'
            })
        }
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        copyClipboard: copyClipboard,
        copyResultString: copyResultString
    };
    
});
