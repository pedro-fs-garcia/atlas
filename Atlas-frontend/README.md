# Atlas Frontend

Frontend da aplicação Atlas - Um sistema para gerenciar continentes, países e observações culturais.

## Tecnologias

- **React 19** com **TypeScript**
- **Vite** para build e desenvolvimento
- **React Router** para roteamento
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado de autenticação

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

### Instalação

```bash
cd Atlas-frontend
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## Funcionalidades

- ✅ Autenticação (Login/Register) com JWT
- ✅ Gerenciamento de Continentes (CRUD completo)
- ✅ Gerenciamento de Países (CRUD completo)
- ✅ Observações Culturais com filtros
- ✅ Controle de propriedade (usuários só editam suas observações)
- ✅ Design responsivo com dark/light mode

## Páginas

- `/` - Home
- `/login` - Login
- `/register` - Registro
- `/continents` - Continentes
- `/countries` - Países
- `/observations` - Observações Culturais
