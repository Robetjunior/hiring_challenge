const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, '../public/swagger.json');    // onde o TSOA deixa
const OUTPUT = INPUT; // sobrescreve no mesmo arquivo

const generic = {
  BadRequest: {
    description: "Request inválida",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 400 },
            message:    { type: "string",  example: "Invalid input data" }
          }
        }
      }
    }
  },
  NotFound: {
    description: "Recurso não encontrado",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 404 },
            message:    { type: "string",  example: "Resource not found" }
          }
        }
      }
    }
  },
  Conflict: {
    description: "Conflito de estado do recurso",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 409 },
            message:    { type: "string",  example: "Dependency exists, cannot delete" }
          }
        }
      }
    }
  }
};

function augment(swagger) {
  // 1. adicionar components.responses
  swagger.components = swagger.components || {};
  swagger.components.responses = {
    ...swagger.components.responses,
    ...generic
  };

  // 2. percorre cada operação em paths
  for (const [pathKey, pathItem] of Object.entries(swagger.paths)) {
    for (const opKey of Object.keys(pathItem)) {
      const op = pathItem[opKey];
      if (!op.responses) continue;
      // sempre incluir 400 em tudo que não for delete sem body
      op.responses["400"] = op.responses["400"] || { $ref: "#/components/responses/BadRequest" };
      // incluir 404 se tiver parâmetro path
      if ( (op.parameters||[]).some(p => p.in === 'path') ) {
        op.responses["404"] = op.responses["404"] || { $ref: "#/components/responses/NotFound" };
      }
      // incluir 409 se delete ou post for criação/deleção
      if (["post","put","delete"].includes(opKey)) {
        op.responses["409"] = op.responses["409"] || { $ref: "#/components/responses/Conflict" };
      }
    }
  }
  return swagger;
}

(async () => {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const swagger = JSON.parse(raw);
  const out = augment(swagger);
  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2), 'utf8');
  console.log("✅ swagger.json foi augmentado com respostas genéricas");
})();
