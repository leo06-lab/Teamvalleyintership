# TeamValley Platform

TeamValley eshte nje platforme rekrutimi me dy pjese kryesore: backend API dhe frontend web. Projekti eshte ndertuar per te lidhur kandidatet me kompanite, duke ofruar menaxhim te vendeve te punes, aplikimeve dhe roleve te perdoruesve ne nje sistem te vetem.

## Qellimi i projektit

- Kandidatet te kerkojne pune dhe te aplikojne online
- Kompanite te publikojne vende pune dhe te menaxhojne aplikimet
- Admini te mbikeqyre platformen, perdoruesit dhe permbajtjen

## Rolet ne sistem

- Candidate: sheh punet, aplikon, ruan punet e preferuara, menaxhon profilin
- Company: krijon dhe menaxhon shpallje pune, sheh aplikimet e marra
- Admin: menaxhon perdorues, kompani, pune, aplikime dhe review

## Arkitektura

- Frontend: React, React Router, Axios, Bootstrap
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB

Komunikimi behet me REST API. Frontend dergon kerkesat te backend dhe backend lexon/shkruan te dhenat ne MongoDB.

## Struktura e pergjithshme e repo-s

- teamvalley_backend: serveri, route, controller, model dhe middleware
- teamvalley_frontend: aplikacioni React me faqe publike dhe dashboard sipas roleve

## Funksionalitete kryesore

- Regjistrim dhe login me role
- Autentikim me token
- Lista e vendeve te punes dhe faqja e detajeve
- Aplikim per pune nga kandidatet
- Menaxhim pune dhe aplikimesh nga kompanite
- Panel administrimi per kontroll te platformes
- Kontakt dhe review

## Setup lokal i plote

## 1 Nis backend

Shko te folderi teamvalley_backend dhe instalo varesite:

npm install

Krijo nje file .env me te pakten keto vlera:

MONGO_URI=vendos_lidhjen_mongo
# ose DB_URL=vendos_lidhjen_mongo
JWT_SECRET=vendos_nje_secret
PORT=5000

Nis serverin:

npm run dev

Ose per start normal:

npm start

Opsionale, per krijimin e admin-it fillestar:

npm run seed:admin

Backend duhet te jete aktiv ne adresen http://localhost:5000.

## 2 Nis frontend

Shko te folderi teamvalley_frontend dhe instalo varesite:

npm install

Nis aplikacionin:

npm start

Frontend hapet ne adresen http://localhost:3000.

## Konfigurimi i API ne frontend

Frontend perdor endpoint bazik:

http://localhost:5000/api

Ky konfigurim menaxhohet ne src/api/axios.js.

## Autentikimi ne frontend

- Token ruhet ne localStorage me celesin jobvalleyToken
- Axios interceptor e shton automatikisht token ne Authorization header

## Komanda te rendesishme

Backend:

- npm run dev
- npm start
- npm run seed:admin

Frontend:

- npm start
- npm run build
- npm test

## Build per production

Per frontend:

npm run build

Build krijohet te folderi build.

## Shenime te rendesishme

- Nese backend nuk eshte aktiv, funksionet me API ne frontend nuk punojne
- Sigurohu qe MONGO_URI ne backend eshte i sakte
- CORS aktualisht eshte i konfiguruar per frontend ne localhost:3000
