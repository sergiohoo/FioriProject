sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller, formatter) {

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onCreateIncidence () {
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length;
            odata.push({ index: index + 1 });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);
        };

        function onDeleteIncidence (oEvent) {
            var tableIncidence = this.getView().byId("tableIncidence");
            var rowIncidence = oEvent.getSource().getParent().getParent();
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var contextObject = rowIncidence.getBindingContext("incidenceModel");

            odata.splice(contextObject.index - 1, 1);
            for (var i in odata) {
                odata[i].index = parseInt(i) + 1;
            }

            incidenceModel.refresh();
            tableIncidence.removeContent(rowIncidence);

            for (var j in tableIncidence.getContent()) {
                tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
            }
        };

        function onSaveIncidence(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var rowIncidence = incidence.getBindingContext("incidenceModel");
            var temp = rowIncidence.sPath.replace('/','');
            this._bus.publish("incidence", "onSaveIncidence", {rowIncidence: rowIncidence.sPath.replace('/','')})
        };

        function updateIncidenceCreationDate (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.CreationDateX = true;
        };

        function updateIncidenceReason (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.ReasonX = true;
        };

        function updateIncidenceType (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.TypeX = true;
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