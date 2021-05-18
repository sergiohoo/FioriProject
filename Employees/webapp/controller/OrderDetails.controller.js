// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.routing.History} History 
     * @param {typeof sap.m.MessageBox} MessageBox 
     */
    function (Controller, History, MessageBox) {

        function _onObjectMatched(oEvent) {
            //Limpia la firma al acceder
            this.onClearSignature();

            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
                model: "odataNorthwind",
                events: {
                    dataReceived: function (oData) {
                        _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
                }
            });

            const objectContext = this.getView().getModel("odataNorthwind").getContext("/Orders("
                + oEvent.getParameter("arguments").OrderID + ")").getObject();
            if (objectContext) {
                _readSignature.bind(this)(objectContext.OrderID, objectContext.EmployeeID);
            }
        }

        function _readSignature(orderId, employeeId) {
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId
                + "',SapId='" + this.getOwnerComponent().SapId
                + "',EmployeeId='" + employeeId + "')", {
                success: function (data) {
                    const signature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }
                }.bind(this),
                error: function (data) {

                }
            });
        };

        return Controller.extend("logaligroup.Employees.controller.OrderDetails", {

            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },
            onBack: function (oEvent) {
                let oHistory = History.getInstance();
                let sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true);
                }
            },
            onClearSignature: function (oEvent) {
                let signature = this.byId("signature");
                signature.clear();
            },

            factoryOrderDetails: function (listId, oContext) {
                let contextObject = oContext.getObject();
                contextObject.Currency = "EUR";
                let unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

                if (contextObject.Quantity <= unitsInStock) {
                    let objectListItem = new sap.m.ObjectListItem({
                        title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                        number: "{parts: [" +
                            "{path: 'odataNorthwind>UnitPrice'}, " +
                            "{path: 'odataNorthwind>Currency'}], " +
                            "type: 'sap.ui.model.type.Currency', " +
                            "formatOptions: {showMeasure: false}}",
                        numberUnit: "{odataNorthwind>Currency}"
                    });
                    return objectListItem;
                }
                else {
                    let customListItem = new sap.m.CustomListItem({
                        content: [
                            new sap.m.Bar({
                                contentLeft: new sap.m.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})" }),
                                contentMiddle: new sap.m.ObjectStatus({ text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error" }),
                                contentRight: new sap.m.Label({
                                    text: "{parts: [" +
                                        "{path: 'odataNorthwind>UnitPrice'}, " +
                                        "{path: 'odataNorthwind>Currency'}], " +
                                        "type: 'sap.ui.model.type.Currency'}"
                                })
                            })
                        ]
                    });
                    return customListItem;
                }
            },

            onSaveSignature: function (oEvent) {
                const signature = this.getView().byId("signature");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let signaturePNG;

                if(!signature.isFill()) {
                    MessageBox.error(oResourceBundle.getText("pleaseFillSignature"))
                } else {
                    signaturePNG = signature.getSignature().replace("data:image/png;base64,", "");
                    let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                    
                    let body = {
                        OrderId: objectOrder.OrderID.toString(),
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: objectOrder.EmployeeID.toString(),
                        MimeType: "image/png",
                        MediaContent: signaturePNG
                    };

                    this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                        success: function () {
                            MessageBox.information(oResourceBundle.getText("signatureSaved"));
                        },
                        error: function () {
                            MessageBox.error(oResourceBundle.getText("signatureNotSaved"));
                        },
                    });
                }
            }
        });
    });