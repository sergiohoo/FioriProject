sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        function onInit() {
            var oJSONModel = new JSONModel();
            var oView = this.getView();
            var i18nBundle = oView.getModel("i18n").getResourceBundle();

            var oJSON = {
                employeeId: "123456",
                countryKey: "UK",
                listCountry: [
                    {
                        key: "US",
                        text: i18nBundle.getText("countryUS")
                    },
                    {
                        key: "UK",
                        text: i18nBundle.getText("countryUK")
                    },
                    {
                        key: "ES",
                        text: i18nBundle.getText("countryES")
                    }
                ]
            };

            oJSONModel.setData(oJSON);
            oView.setModel(oJSONModel);
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

        Main.prototype.onValidate = function () {
            var inputEmployee = this.getView().byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("Not OK");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            };
        }

        Main.prototype.onInit = onInit;
        return Main;
    });
