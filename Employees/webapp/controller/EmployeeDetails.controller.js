sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.m.MessageBox} MessageBox 
     */
    function (Controller, formatter, MessageBox) {

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onCreateIncidence () {
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length;
            odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);
        };

        function onDeleteIncidence (oEvent) {
            var contextObject = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            this._bus.publish("incidence", "onDeleteIncidence", {
                IncidenceId: contextObject.IncidenceId,
                SapId: contextObject.SapId,
                EmployeeId: contextObject.EmployeeId
            });
        };

        function onSaveIncidence(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var rowIncidence = incidence.getBindingContext("incidenceModel");
            var temp = rowIncidence.sPath.replace('/','');
            this._bus.publish("incidence", "onSaveIncidence", {rowIncidence: rowIncidence.sPath.replace('/','')})
        };

        function updateIncidenceCreationDate (oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            
            if(!oEvent.getSource().isValidValue()) {
                contextObject._ValidateDate = false;
                contextObject.CreationDateState = "Error";
                MessageBox.error(oResourceBundle.getText("invalidDate"), {
                    title: "Error",
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedActions: null,
                    initalFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            }
            else {
                contextObject.CreationDateX = true;
                contextObject._ValidateDate = true;
                contextObject.CreationDateState = "None";
            };

            if(oEvent.getSource().isValidValue() && contextObject.Reason) {
                contextObject.EnabledSave = true;
            }
            else {
                contextObject.EnabledSave = false;
            }

            context.getModel().refresh();
        };

        function updateIncidenceReason (oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();

            if(!oEvent.getSource().getValue()) {
                contextObject.ReasonState = "Error";
            }
            else {
                contextObject.ReasonX = true;
                contextObject.ReasonState = "None";
            }

            if(oEvent.getSource().getValue() && contextObject._ValidateDate) {
                contextObject.EnabledSave = true;
            }
            else {
                contextObject.EnabledSave = false;
            }

            context.getModel().refresh();
        };

        function updateIncidenceType (oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();
            contextObject.TypeX = true;

            if(contextObject.Reason && contextObject._ValidateDate) {
                contextObject.EnabledSave = true;
            }
            else {
                contextObject.EnabledSave = false;
            }

            context.getModel().refresh();
        };

        var EmployeeDetails = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
        EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
        EmployeeDetails.prototype.Formatter = formatter;
        EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
        EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
        EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
        EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;
    });