sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller) {

        return Controller.extend("logaligroup.Employees.controller.Main", {

            onInit: function () {
                var oView = this.getView();
                // var i18nBundle = oView.getModel("i18n").getResourceBundle();

                var oJSONModelEmployees = new sap.ui.model.json.JSONModel();
                oJSONModelEmployees.loadData("./localService/mockdata/Employees.json", false);
                oView.setModel(oJSONModelEmployees, "jsonEmployees");

                var oJSONModelCountries = new sap.ui.model.json.JSONModel();
                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelCountries, "jsonCountries");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonModelConfig");

                var oJSONModelLayout = new sap.ui.model.json.JSONModel();
                oJSONModelLayout.loadData("./localService/mockdata/Layout.json", false);
                oView.setModel(oJSONModelLayout, "jsonLayout");
            }
        });
    });