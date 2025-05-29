# Abordagem Geral – Desafio 02

## Entregáveis
- Código atualizado do backend e da API  
- Interface do frontend com lista e calendário de manutenções  
- Migration(s) para criar e evoluir a tabela `maintenance`  
- DTOs, controllers e serviços alinhados com regras de negócio  
- Componentes React para CRUD e calendário  
- **Instruções de como executar e testar a solução:**
  1. Clone este repositório e instale as dependências:
     ```bash
     cd backend
     yarn install
     cd ../frontend
     yarn install
     ```
  2. Execute as migrations e rode o servidor de desenvolvimento:
     ```bash
     cd backend
     yarn build
     yarn dev   # servidor backend em http://localhost:3001
     ```
  3. Inicie o frontend:
     ```bash
     cd frontend
     yarn dev   # app em http://localhost:3000
     ```
  4. Testes:
     - **Backend unitários**:
       ```bash
       cd backend
       yarn test
       ```
     - **Backend integração** (endpoints em memória):
       ```bash
       cd backend
       yarn test:integration
       ```
     - **Verificação manual frontend**:
       - Acesse http://localhost:3000/maintenance para CRUD
       - Acesse http://localhost:3000/maintenance/calendar para o calendário
       
## 1. Visão de Alto Nível  
- **Camada de Persistência**  
  - Nova entidade `Maintenance` com campos: `title`, `dueDate`, `fixedDate`, `intervalMonths`, `baseType`, e relacionamentos Many-To-One para `Part`, `Equipment`, `Area` e `Plant`.  
  - Migrations para criar a tabela `maintenance` e evoluir seu schema quando necessário (e.g. adicionar `baseType`).

- **Regras de Negócio**  
  - **Cálculo de `dueDate`:**  
    - Se informado `fixedDate` → usa‐se essa data.  
    - Senão, se informado `dueDate` → usa‐se essa data.  
    - Senão, se informado `intervalMonths` → adiciona meses ao "baseDate":  
      - `baseType="equipment"` → data de início de operação do equipamento.  
      - `baseType="piece"` (default) → data de instalação da peça.  
    - Validações para impedir datas anteriores a hoje e coerência entre `fixedDate` e `dueDate`.

- **API / Controllers (TSOA)**  
  - Endpoints CRUD em `/maintenance` e rota GET `/maintenance/upcoming`.  
  - DTOs `CreateMaintenanceDTO` e `UpdateMaintenanceDTO` com validações de classe (`class-validator`).  
  - Tratamento de erros customizados:  
    - `InvalidDataError` → 400 Bad Request  
    - `NotFoundError` → 404 Not Found  

- **Front-end (Next.js + Ant Design + React-Query)**  
  - **Lista de Manutenções**  
    - Tabela com colunas: Data Limite, Título, Base, Peça, Equipamento, Área, Planta, Ações.  
  - **Formulário de Agendamento** (`MaintenanceForm`)  
    - Campos: título, `fixedDate`, `baseType`, `intervalMonths`, `dueDate`, seletores para peça/equipamento/área/planta.  
    - Validações dependentes (ex.: `dueDate` ≥ `fixedDate + intervalMonths`).  
  - **Calendário de Manutenções**  
    - Componente `MaintenanceCalendar` usando `<Calendar>` do AntD, destacando eventos por dia com `Badge`.  
  - **Serviços de API** (`maintenanceApi`)  
    - Métodos: `getAll()`, `getUpcoming()`, `getById()`, `create()`, `update()`, `delete()` alinhados aos DTOs do back.

## 2. Detalhamento das Alterações

1. **Banco de Dados / Modelos**  
   - Criar migration inicial e posteriores (e.g. `AddBaseTypeToMaintenance`).  
   - Entidade `Maintenance` em `models/Maintenance.ts`, com `@CreateDateColumn` e `@UpdateDateColumn`.

2. **Serviço de Negócio** (`MaintenanceService`)  
   - Métodos: `findAll()`, `findUpcoming()`, `findById()`, `create()`, `update()`, `delete()`.  
   - Lógica de validação e cálculo de datas dentro de `create` e `update`.  

3. **Controller** (`MaintenanceController`)  
   - Rotas TSOA mapeadas; ordenação correta de GET `/upcoming` antes de GET `/{id}`.  
   - Tratamento de erros e status HTTP adequado.

4. **Documentação / OpenAPI**  
   - Atualizar spec gerado pelo TSOA para incluir os schemas `Maintenance`, `CreateMaintenanceDTO` e `UpdateMaintenanceDTO`.  
   - Certificar que respostas 400/404/409 estão referenciadas em todos os métodos.

5. **Front-end**  
   - **Páginas**  
     - `src/app/maintenance/page.tsx` (lista + ações).  
     - `src/app/maintenance/calendar/page.tsx` (calendário).  
   - **Componentes**  
     - `MaintenanceForm.tsx` com lógica de pré-população e validações via AntD.  
     - `MaintenanceCalendar.tsx` para renderizar eventos.  
   - **API Client**  
     - `services/api.ts` adição de `maintenanceApi`.  
   - **State & Data-Fetching**  
     - React-Query hooks para buscar/manipular manutenções e opções de `parts`, `equipments`, `areas`, `plants`.  

## 3. Suposições e Decisões

- **Data como ISO-8601** em payloads JSON; conversão no front (DatePicker → `.toDate()`) e no back (string → `new Date()`).  
- **Intervalos mensais** adicionam meses inteiros sem compensação de dias.  
- **Exibição futura**: rota `/maintenance/upcoming` só retorna manutenções a partir de hoje (inclusive).  
- **Front-end** assume que todas as entidades relacionadas já existem; não há fluxo de criação inline de peças/equipamentos/etc.  
