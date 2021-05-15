sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.routing.History} History 
     */
    function (Controller, History) {

        function _onObjectMatched(oEvent) {
            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
                model: "odataNorthwind"
            });
        }

        return Controller.extend("logaligroup.Employees.controller.OrderDetails", {

            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },
            onBack: function (oEvent) {
                let oHistory = History.getInstance();
                let sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true);
                }
            }
        });
    });