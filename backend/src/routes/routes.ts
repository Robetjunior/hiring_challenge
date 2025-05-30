/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlantController } from './../controllers/PlantController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PartController } from './../controllers/PartController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MaintenanceController } from './../controllers/MaintenanceController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EquipmentController } from './../controllers/EquipmentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AreaController } from './../controllers/AreaController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Plant": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "areas": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "maintenances": {"dataType":"array","array":{"dataType":"refObject","ref":"Maintenance"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Area": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "locationDescription": {"dataType":"string","required":true},
            "plant": {"ref":"Plant"},
            "plantId": {"dataType":"string","required":true},
            "equipment": {"dataType":"array","array":{"dataType":"refObject","ref":"Equipment"}},
            "neighbors": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "maintenances": {"dataType":"array","array":{"dataType":"refObject","ref":"Maintenance"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PartType": {
        "dataType": "refEnum",
        "enums": ["electric","electronic","mechanical","hydraulical"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Equipment": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "initialOperationsDate": {"dataType":"datetime","required":true},
            "area": {"ref":"Area"},
            "areaId": {"dataType":"string","required":true},
            "areas": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "parts": {"dataType":"array","array":{"dataType":"refObject","ref":"Part"}},
            "maintenances": {"dataType":"array","array":{"dataType":"refObject","ref":"Maintenance"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Part": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"ref":"PartType","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "installationDate": {"dataType":"datetime","required":true},
            "equipment": {"ref":"Equipment"},
            "equipmentId": {"dataType":"string","required":true},
            "maintenances": {"dataType":"array","array":{"dataType":"refObject","ref":"Maintenance"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Maintenance": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "dueDate": {"dataType":"datetime","required":true},
            "intervalMonths": {"dataType":"double"},
            "fixedDate": {"dataType":"datetime"},
            "baseType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["equipment"]}],"required":true},
            "part": {"ref":"Part","required":true},
            "partId": {"dataType":"string","required":true},
            "equipment": {"ref":"Equipment","required":true},
            "equipmentId": {"dataType":"string","required":true},
            "area": {"ref":"Area","required":true},
            "areaId": {"dataType":"string","required":true},
            "plant": {"ref":"Plant","required":true},
            "plantId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Plant.name-or-address_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_Plant.name-or-address__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"address":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Part.Exclude_keyofPart.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"equipment":{"ref":"Equipment"},"name":{"dataType":"string","required":true},"type":{"ref":"PartType","required":true},"manufacturer":{"dataType":"string","required":true},"serialNumber":{"dataType":"string","required":true},"installationDate":{"dataType":"datetime","required":true},"equipmentId":{"dataType":"string","required":true},"maintenances":{"dataType":"array","array":{"dataType":"refObject","ref":"Maintenance"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Part.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Part.Exclude_keyofPart.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Omit_Part.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"equipment":{"ref":"Equipment"},"name":{"dataType":"string"},"type":{"ref":"PartType"},"manufacturer":{"dataType":"string"},"serialNumber":{"dataType":"string"},"installationDate":{"dataType":"datetime"},"equipmentId":{"dataType":"string"},"maintenances":{"dataType":"array","array":{"dataType":"refObject","ref":"Maintenance"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMaintenanceDTO": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "fixedDate": {"dataType":"string"},
            "intervalMonths": {"dataType":"double"},
            "dueDate": {"dataType":"string"},
            "partId": {"dataType":"string","required":true},
            "equipmentId": {"dataType":"string","required":true},
            "areaId": {"dataType":"string","required":true},
            "plantId": {"dataType":"string","required":true},
            "baseType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["equipment"]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateMaintenanceDTO": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "fixedDate": {"dataType":"string"},
            "intervalMonths": {"dataType":"double"},
            "dueDate": {"dataType":"string"},
            "partId": {"dataType":"string"},
            "equipmentId": {"dataType":"string"},
            "areaId": {"dataType":"string"},
            "plantId": {"dataType":"string"},
            "baseType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["equipment"]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateEquipmentDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "initialOperationsDate": {"dataType":"datetime","required":true},
            "areas": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateEquipmentDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "manufacturer": {"dataType":"string"},
            "serialNumber": {"dataType":"string"},
            "initialOperationsDate": {"dataType":"datetime"},
            "areas": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Area.name-or-locationDescription-or-plantId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"locationDescription":{"dataType":"string","required":true},"plantId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_Area.name-or-locationDescription-or-plantId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"locationDescription":{"dataType":"string"},"plantId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsPlantController_getPlants: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plants',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.getPlants)),

            async function PlantController_getPlants(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_getPlants, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'getPlants',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_getPlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
        };
        app.get('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.getPlant)),

            async function PlantController_getPlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_getPlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'getPlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_createPlant: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_Plant.name-or-address_"},
        };
        app.post('/plants',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.createPlant)),

            async function PlantController_createPlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_createPlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'createPlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_updatePlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_Plant.name-or-address__"},
        };
        app.put('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.updatePlant)),

            async function PlantController_updatePlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_updatePlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'updatePlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_deletePlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
        };
        app.delete('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.deletePlant)),

            async function PlantController_deletePlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_deletePlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'deletePlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_getParts: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/parts',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.getParts)),

            async function PartController_getParts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_getParts, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'getParts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_getPartById: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.get('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.getPartById)),

            async function PartController_getPartById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_getPartById, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'getPartById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_createPart: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Omit_Part.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/parts',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.createPart)),

            async function PartController_createPart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_createPart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'createPart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_updatePart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Omit_Part.id-or-createdAt-or-updatedAt__"},
        };
        app.put('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.updatePart)),

            async function PartController_updatePart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_updatePart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'updatePart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_deletePart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.delete('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.deletePart)),

            async function PartController_deletePart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_deletePart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'deletePart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/maintenance',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getAll)),

            async function MaintenanceController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getAll, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getUpcoming: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/maintenance/upcoming',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getUpcoming)),

            async function MaintenanceController_getUpcoming(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getUpcoming, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getUpcoming',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/maintenance/:id',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getById)),

            async function MaintenanceController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getById, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_create: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"CreateMaintenanceDTO"},
        };
        app.post('/maintenance',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.create)),

            async function MaintenanceController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_create, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                dto: {"in":"body","name":"dto","required":true,"ref":"UpdateMaintenanceDTO"},
        };
        app.put('/maintenance/:id',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.update)),

            async function MaintenanceController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_update, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/maintenance/:id',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.delete)),

            async function MaintenanceController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_delete, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipment: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/equipment',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipment)),

            async function EquipmentController_getEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipmentById: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.get('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipmentById)),

            async function EquipmentController_getEquipmentById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipmentById, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipmentById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_createEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CreateEquipmentDTO"},
        };
        app.post('/equipment',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.createEquipment)),

            async function EquipmentController_createEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_createEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'createEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_updateEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UpdateEquipmentDTO"},
        };
        app.put('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.updateEquipment)),

            async function EquipmentController_updateEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_updateEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'updateEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_deleteEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.delete('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.deleteEquipment)),

            async function EquipmentController_deleteEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_deleteEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'deleteEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getAreas: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/areas',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getAreas)),

            async function AreaController_getAreas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getAreas, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getAreas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.get('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getArea)),

            async function AreaController_getArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_createArea: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_Area.name-or-locationDescription-or-plantId_"},
        };
        app.post('/areas',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.createArea)),

            async function AreaController_createArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_createArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'createArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_updateArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_Area.name-or-locationDescription-or-plantId__"},
        };
        app.put('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.updateArea)),

            async function AreaController_updateArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_updateArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'updateArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_deleteArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.delete('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.deleteArea)),

            async function AreaController_deleteArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_deleteArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'deleteArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getNeighbors: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.get('/areas/:areaId/neighbors',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getNeighbors)),

            async function AreaController_getNeighbors(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getNeighbors, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getNeighbors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_addNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                neighborId: {"in":"path","name":"neighborId","required":true,"dataType":"string"},
        };
        app.post('/areas/:areaId/neighbors/:neighborId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.addNeighbor)),

            async function AreaController_addNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_addNeighbor, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'addNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_removeNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                neighborId: {"in":"path","name":"neighborId","required":true,"dataType":"string"},
        };
        app.delete('/areas/:areaId/neighbors/:neighborId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.removeNeighbor)),

            async function AreaController_removeNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_removeNeighbor, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'removeNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
