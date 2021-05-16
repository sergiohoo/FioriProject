sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller) {

        return Controller.extend("logaligroup.Employees.controller.Base", {

            onInit: function () {

            },

            toOrdersDetails: function (oEvent) {
                var orderId = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrderDetails", {
                    OrderID: orderId
                });
            }

        });
    });


