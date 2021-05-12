sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.m.MessageBox} MessageBox
     */
    function (Controller, MessageBox) {

        return Controller.extend("logaligroup.Employees.controller.Main", {

            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("detailEmployeeView");
            },

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

                this._bus = sap.ui.getCore().getEventBus();

                this._bus.subscribe("flexible", "onShowEmployee", this.showEmployeeDetails, this);

                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);
                this._bus.subscribe("incidence", "onDeleteIncidence", this.onDeleteODataIncidence, this);
            },

            onDeleteODataIncidence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                this.getView().getModel("incidenceModel")
                        .remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                            "',SapId='" + data.SapId +
                            "',EmployeeId='" + data.EmployeeId + "')", {
                            success: function () {
                                this.onReadODataIncidence.bind(this)(data.EmployeeId.toString());
                                sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"), { duration: 20000 });
                            }.bind(this),
                            error: function () {
                                this.onReadODataIncidence.bind(this)(data.EmployeeId.toString());
                                sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteError"));
                            }.bind(this)
                        });
            },

            onSaveODataIncidence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                if (typeof incidenceModel[data.rowIncidence].IncidenceId === 'undefined') {
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.rowIncidence].CreationDate,
                        Type: incidenceModel[data.rowIncidence].Type,
                        Reason: incidenceModel[data.rowIncidence].Reason
                    };

                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId.toString());
                            MessageBox.success(oResourceBundle.getText("odataSaveOK"));
                            //sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"),{duration:20000});
                        }.bind(this),
                        error: function (e) {
                            this.onReadODataIncidence.bind(this)(employeeId.toString());
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveError"));
                        }.bind(this)
                    });
                }
                else if (incidenceModel[data.rowIncidence].CreationDateX ||
                    incidenceModel[data.rowIncidence].ReasonX ||
                    incidenceModel[data.rowIncidence].TypeX) {

                    var body = {
                        CreationDate: incidenceModel[data.rowIncidence].CreationDate,
                        CreationDateX: incidenceModel[data.rowIncidence].CreationDateX,
                        Type: incidenceModel[data.rowIncidence].Type,
                        TypeX: incidenceModel[data.rowIncidence].TypeX,
                        Reason: incidenceModel[data.rowIncidence].Reason,
                        ReasonX: incidenceModel[data.rowIncidence].ReasonX
                    }

                    this.getView().getModel("incidenceModel")
                        .update("/IncidentsSet(IncidenceId='" + incidenceModel[data.rowIncidence].IncidenceId +
                            "',SapId='" + incidenceModel[data.rowIncidence].SapId +
                            "',EmployeeId='" + incidenceModel[data.rowIncidence].EmployeeId + "')", body, {
                            success: function () {
                                this.onReadODataIncidence.bind(this)(employeeId.toString());
                                sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"), { duration: 20000 });
                            }.bind(this),
                            error: function () {
                                this.onReadODataIncidence.bind(this)(employeeId.toString());
                                sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateError"));
                            }.bind(this)
                        });

                }
                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataSaveNoChanges"));
                }
            },

            onReadODataIncidence: function (employeeId) {
                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", employeeId)
                    ],
                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {

                            data.results[incidence]._ValidateDate = true;
                            data.results[incidence].EnabledSave = false;

                            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence",
                                this._detailEmployeeView.getController());
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),
                    error: function (e) {

                    }
                })
            },

            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                this.onReadODataIncidence(employeeId);
            }
        });
    });