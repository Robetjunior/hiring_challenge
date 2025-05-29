# Abordagem Geral – Desafio 01

## Entregáveis
- Código atualizado do backend e da API  
- Interface do frontend atualizada com o novo comportamento  
- Scripts de migração, dados de exemplo ou alterações de configuração necessárias  
- Explicação clara da sua abordagem  
- **Instruções de como executar e testar a solução:**
  1. Clone este repositório e instale as dependências:
     ```bash
     cd backend
     yarn install
     cd ../frontend
     yarn install
     ```
  2. Rode as migrations e inicie o servidor de desenvolvimento:
     ```bash
     cd backend
     yarn build
     yarn dev   # servidor na porta 3001
     ```
  3. Inicie o frontend:
     ```bash
     cd frontend
     yarn dev   # aplicativo em http://localhost:3000
     ```
  4. Para testar:
     - **Unitários**:  
       ```bash
       cd backend
       yarn test      # Jest
       ```
     - **Integração** (endpoints em memória):  
       ```bash
       cd backend
       yarn test:integration
       ```
     - **Front-end**: abra http://localhost:3000/areas e http://localhost:3000/equipment e verifique CRUD e vizinhanças.

## Entendimento do Domínio

Áreas pertencem a Plantas; Equipamentos pertencem hoje a uma única Área.

**Novo requisito:** Áreas podem ser vizinhas (relação simétrica), e Equipamentos podem pertencer a múltiplas Áreas vizinhas.

## Modelagem Incremental

Manter compatibilidade: preservar `Area.areaId` e `Equipment.area` para não quebrar integrações existentes.

Adicionar relacionamentos muitos-para-muitos:

- Tabela de join `area_neighbors` ↔ `Area.neighbors`.
- Tabela de join `equipment_areas` ↔ `Equipment.areas`.

## Validação de Regras de Negócio

No backend, ao adicionar vizinhos: proibir self-neighbor e criar relacionamento bidirecional.

Ao criar/atualizar Equipment com múltiplas áreas:

- Verificar que todas as áreas escolhidas são mutuamente vizinhas (via serviço de área).
- Garantir pelo menos 1 área selecionada.

## API e Documentação

Utilizar TSOA para gerar controllers e contratos TypeScript.

Expor novos endpoints REST:

- `GET /areas/{id}/neighbors`
- `POST /areas/{id}/neighbors/{nid}`
- `DELETE /areas/{id}/neighbors/{nid}`

Atualizar Swagger/OpenAPI com componentes de resposta genérica (400, 404, 409).

## Front-end

**Áreas:** botão "Neighbors" abre modal de seleção múltipla, integrando `areaApi.getNeighbors()` / `addNeighbor()` / `removeNeighbor()`.

**Equipamentos:** substituir Select único por `Select.mode="multiple"`, com lógica de filtro dinâmico para só permitir combinações de áreas que sejam vizinhas.

Ajustar colunas e ações na tabela para refletir as novas relações.

## Testes

**Unitários:** Service de Área (adição/remoção de vizinhos, restrições), Service de Equipment (validações de vizinhança).

**Integração:** rodar endpoints contra banco em memória, garantindo que as migrations criam `area_neighbors` e `equipment_areas` e que os fluxos REST cumprem o contrato Swagger.
