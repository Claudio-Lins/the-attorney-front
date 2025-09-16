# Roteiro de Refatoração: Integração de Clientes e Autenticação

Este documento descreve o plano passo-a-passo para refatorar o projeto, integrando a nova entidade `client` com o sistema de autenticação existente.

## O Objetivo

O objetivo é permitir que um `client` seja criado no sistema (via automação n8n) sem credenciais de autenticação. Posteriormente, um administrador enviará um link para o cliente, permitindo que ele crie uma senha e ative sua conta para login.

## Plano de Ação

### Passo 1: Atualizar o Schema do Banco de Dados (`prisma/schema.prisma`)

O primeiro passo é unificar o schema do Prisma existente com os novos modelos necessários.

1.  **Backup:** Faça uma cópia de segurança do seu arquivo `prisma/schema.prisma` atual.
2.  **Mesclar Modelos:** Adicione os novos modelos (`client`, `address`, `service`, etc.) ao arquivo.
3.  **Ligar `client` e `User`:** Para conectar um cliente à sua conta de usuário autenticável, adicionaremos uma relação. O modelo `client` será modificado para se conectar ao modelo `User`. Isso permitirá que um `client` exista sem um `User`, mas possa ser vinculado a um quando a senha for criada.
4.  **Remover Redundância:** Campos como `password` e `role` serão removidos do modelo `client` para evitar duplicação com o modelo `User`, que será a única fonte para autenticação e papéis.

### Passo 2: Criar e Aplicar a Nova "Migration"

Com o schema atualizado, precisamos aplicar as mudanças ao banco de dados.

1.  **Gerar a Migration:** Execute o comando abaixo no seu terminal para criar um novo arquivo de migration que contém as alterações do schema:
    ```bash
    bunx prisma migrate dev --name add_client_models
    ```
2.  **Verificar o Banco:** Após a execução, o Prisma terá aplicado as novas tabelas e colunas ao seu banco de dados de desenvolvimento.

### Passo 3: Criar a Página de Criação de Senha

Precisamos de uma nova página onde o cliente possa definir sua senha.

1.  **Criar a Rota:** Crie uma nova página em `src/app/[locale]/(auth)/create-password/page.tsx`.
2.  **Receber Parâmetros:** A página deverá ler os parâmetros `clientId` e `email` da URL.
3.  **Construir o Formulário:** Crie um formulário com campos para "Senha" e "Confirmar Senha".

### Passo 4: Implementar a Lógica no Server Action

O formulário de criação de senha enviará os dados para um "Server Action" que cuidará da lógica de criação do usuário.

1.  **Criar o Action:** Crie um novo arquivo, por exemplo, `src/actions/client-auth-actions.ts`.
2.  **Implementar a Função:** A função neste arquivo irá:
    a. Receber `clientId`, `email` e a nova `password`.
    b. Validar se o `client` com o `clientId` e `email` fornecidos existe e ainda não possui um `User` associado.
    c. Gerar um hash da senha.
    d. Criar um novo registro na tabela `User` com o email do cliente e a senha com hash.
    e. Atualizar o registro do `client` para vincular o `id` do `User` recém-criado.
    f. (Opcional) Realizar o login automático do usuário na plataforma.

### Passo 5: Ajustar a Sessão de Autenticação (NextAuth.js)

Para que os dados do `client` fiquem disponíveis em toda a aplicação após o login, vamos ajustar a sessão do NextAuth.js.

1.  **Editar Callbacks:** No arquivo de configuração do NextAuth.js (`src/lib/auth.ts`), modifique os callbacks `jwt` e `session`.
2.  **Enriquecer a Sessão:** Na callback `jwt`, quando um usuário fizer login, busque no banco se ele possui um `client` associado. Se sim, adicione o `clientId` e outras informações relevantes ao token.
3.  **Expor na Sessão:** Na callback `session`, passe os dados do `client` do token para o objeto de sessão, tornando-os acessíveis nos componentes do lado do cliente e do servidor.

---

Com estes passos, a nova funcionalidade estará integrada de forma robusta e segura ao sistema existente.
