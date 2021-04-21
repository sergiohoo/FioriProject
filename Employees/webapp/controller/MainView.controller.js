sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";
        
        function MyCheck() {
            var inputEmployee = this.byId("inputEmployee");
                var valueEmployee = inputEmployee.getValue();

                if (valueEmployee.length === 6) {
                    inputEmployee.setDescription("OK");
                } else {
                    inputEmployee.setDescription("Not OK");
                };
        }

		return Controller.extend("logaligroup.Employees.controller.MainView", { 
			onInit: function () {

            },
            
            onValidate: MyCheck
		});
	});
