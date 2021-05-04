sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";
        function onInit() {
            var oView = this.getView();
            // var i18nBundle = oView.getModel("i18n").getResourceBundle();

            var oJSONModelEmployees = new sap.ui.model.json.JSONModel();
            oJSONModelEmployees.loadData("./localService/mockdata/Employees.json",false);
            oView.setModel(oJSONModelEmployees, "jsonEmployees");
            
            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json",false);
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
        }
        function onFilter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];
            if(oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }
            if(oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }
        function onClearFilter() {      
            var oModelCountries = this.getView().getModel("jsonCountries");
            oModelCountries.setProperty("/EmployeeId","");          
            oModelCountries.setProperty("/CountryKey","");          

            var filters = [];
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onShowPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            
            sap.m.MessageToast.show(objectContext.PostalCode);
        }

        function onShowCity () {
            var oModelConfig = this.getView().getModel("jsonModelConfig");
            oModelConfig.setProperty("/visibleCity",true);
            oModelConfig.setProperty("/visibleBtnShowCity",false);
            oModelConfig.setProperty("/visibleBtnHideCity",true);
        }
        
        function onHideCity () {
            var oModelConfig = this.getView().getModel("jsonModelConfig");
            oModelConfig.setProperty("/visibleCity",false);
            oModelConfig.setProperty("/visibleBtnShowCity",true);
            oModelConfig.setProperty("/visibleBtnHideCity",false);
        }

        function onShowOrders (oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            
            sap.m.MessageToast.show(objectContext.Orders);
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
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.onShowPostalCode = onShowPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.onShowOrders = onShowOrders;
        return Main;
    });
