# Passaporte Biker Digital

App em React (artifact) para motociclistas que rodam a **Rota Biker** pelo Brasil.

## Funcionalidades

- **Rota** — planejador de trajeto até um dos 33 monumentos oficiais da Rota Biker, ou uma **rota personalizada** (saída e destino livres), com integração ao Google Maps.
- **Perfil** — cadastro do motociclista (nome, cidade, modelo da moto, motoclube).
- **Motoclube** — upload do brasão do motoclube.
- **Eventos** — mural de eventos de motoclubes, com upload de **flyer** e **lista de confirmação de presença**.

## Stack

- React (function components + hooks)
- Tailwind CSS (utilitários)
- lucide-react (ícones)
- `window.storage` para persistência (dados pessoais e compartilhados)

## Como usar

Este arquivo (`rota-biker-app.jsx`) foi criado como um *artifact* React e roda em ambientes que suportam esse runtime (ex.: Claude.ai). Para rodar como projeto standalone, importe o componente `RotaBikerApp` (export default) dentro de um projeto Vite/CRA com Tailwind configurado e as dependências `lucide-react` instaladas.
