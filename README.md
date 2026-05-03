# MyLibrary

A full-stack library management application built with React and Spring Boot.

**Live application:** [https://my-library-4k8jr7v59-salaheddines-projects-8ddcec67.vercel.app/home](https://my-library-4k8jr7v59-salaheddines-projects-8ddcec67.vercel.app/home)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Bootstrap 5 |
| Backend | Spring Boot 3, Spring Data REST, Spring Security |
| Database | MySQL 8 |
| Authentication | Auth0 (via Okta Spring Boot Starter) |
| Payments | Stripe |
| Frontend hosting | Vercel |
| Backend hosting | Clever Cloud |

---

## Project Structure

```
MyLibrary/
├── Book-Library/          # React frontend
├── Book-Library-Backend/  # Spring Boot backend
├── clevercloud/           # Clever Cloud deployment config
└── Scripts/               # SQL seed scripts (not committed to git)
```

---

## Production Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://my-library-4k8jr7v59-salaheddines-projects-8ddcec67.vercel.app/home |
| Backend (Clever Cloud) | https://app-649c67ee-012f-4521-8ed7-fcaa608e4d74.cleverapps.io |

---

## Authentication — Auth0

This app uses [Auth0](https://auth0.com/) for authentication (OAuth2 / OpenID Connect), integrated on the backend via the Okta Spring Boot Starter.

### How it works

1. The React frontend redirects the user to Auth0's login page
2. After login, Auth0 issues a JWT access token
3. The frontend attaches the token as a `Bearer` header on all secure API calls
4. The Spring Boot backend validates the token using Auth0's public keys

### Auth0 setup required

You need an Auth0 tenant with:

#### Application (SPA)
- Type: **Single Page Application**
- Allowed Callback URLs: `http://localhost:3000/callback, https://<your-vercel-url>/callback`
- Allowed Logout URLs: `http://localhost:3000, https://<your-vercel-url>`
- Allowed Web Origins: `http://localhost:3000, https://<your-vercel-url>`
- Allowed Origins (CORS): `http://localhost:3000, https://<your-vercel-url>`

#### API (Resource Server)
- Identifier (audience): `https://app-649c67ee-012f-4521-8ed7-fcaa608e4d74.cleverapps.io` (production) or `http://localhost:8080` (local)
- Make sure the API is **authorized** in your Application's APIs tab

#### Roles claim
In Auth0 → Actions (or Rules), add a custom claim to include the user's roles in the token:
```javascript
// The claim name used in this app:
https://salaheddine-library.com/roles
```

The backend reads this claim to determine admin access.

---

## Local Development

### Prerequisites

- Java 17+
- Maven (or use `./mvnw`)
- Docker
- Node.js 18+

### 1. Database (MySQL via Docker)

```bash
cd Book-Library-Backend
docker compose up -d
```

This starts MySQL 8 and runs the SQL scripts from `Scripts/` to create tables and seed data.

> `Scripts/` is excluded from git. Obtain the SQL scripts separately and place them in `MyLibrary/Scripts/`.

#### Expected scripts

| File | Description |
|------|-------------|
| `0-React-Springboot-Add-Tables-Script-1.sql` | Creates all tables |
| `React-SpringBoot-Add-Books-Script-2.sql` | Seeds book data |
| `React-SpringBoot-Add-Books-Script-3.sql` | Seeds book data |
| `React-SpringBoot-Add-Books-Script-4.sql` | Seeds book data |
| `React-SpringBoot-Add-Books-Script-5.sql` | Seeds book data |
| `Payment Script/Payment Script.sql` | Seeds payment data |

#### Database credentials

| Property | Value |
|----------|-------|
| Host | `localhost:3306` |
| Database | `reactlibrarydatabase` |
| Username | `mylibrary` |
| Password | `mylibrary` |

```bash
# Access via terminal
docker exec -it mylibrary-mysql mysql -u mylibrary -pmylibrary reactlibrarydatabase

# Reset everything
docker compose down -v && docker compose up -d
```

### 2. Backend (Spring Boot)

Create `Book-Library-Backend/src/main/resources/application-dev.properties` (excluded from git):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/reactlibrarydatabase?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=mylibrary
spring.datasource.password=mylibrary

server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:loveCoding-keystore.p12
server.ssl.key-store-type=PKCS12
server.ssl.key-store-password=<your-keystore-password>
server.ssl.key-alias=<your-key-alias>

spring.jpa.hibernate.ddl-auto=update

okta.oauth2.issuer=https://dev-6qtr30vk60x15j0l.us.auth0.com/
okta.oauth2.client-id=<your-auth0-client-id>
okta.oauth2.groupsClaim=https://salaheddine-library.com/roles
okta.oauth2.audience=http://localhost:8080

stripe.key.secret=<your-stripe-secret-key>
```

#### SSL keystore (local HTTPS)

```bash
keytool -genkeypair -alias certificat-mylibrary -keyalg RSA -keysize 2048 \
  -storetype PKCS12 \
  -keystore Book-Library-Backend/src/main/resources/loveCoding-keystore.p12 \
  -validity 365 -storepass <your-password> \
  -dname "CN=localhost, OU=Dev, O=MyLibrary, L=Paris, S=IDF, C=FR"
```

> The browser will show a security warning for self-signed certificates in development — this is expected.

```bash
cd Book-Library-Backend
./mvnw spring-boot:run
```

Backend runs at: **https://localhost:8443**

### 3. Frontend (React)

```bash
cd Book-Library
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

The `.env` file must contain:

```env
REACT_APP_API=https://localhost:8443/api
REACT_APP_AUTH0_AUDIENCE=http://localhost:8080
```

---

## Clever Cloud Deployment (Backend)

The backend is deployed on Clever Cloud as a Java/Maven application.

### Required environment variables

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `SPRING_DATASOURCE_URL` | MySQL addon JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | MySQL addon username |
| `SPRING_DATASOURCE_PASSWORD` | MySQL addon password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE` | `4` (free tier: max 5 connections) |
| `SERVER_FORWARD_HEADERS_STRATEGY` | `FRAMEWORK` |
| `OKTA_OAUTH2_ISSUER` | `https://dev-6qtr30vk60x15j0l.us.auth0.com/` |
| `OKTA_OAUTH2_AUDIENCE` | `https://app-649c67ee-012f-4521-8ed7-fcaa608e4d74.cleverapps.io` |
| `OKTA_OAUTH2_CLIENTID` | Auth0 application client ID |
| `OKTA_OAUTH2_GROUPSCLAIM` | `https://salaheddine-library.com/roles` |
| `STRIPE_KEY_SECRET` | Stripe secret key |
| `CC_RUN_COMMAND` | `java $JAVA_OPTS -jar $APP_HOME/Book-Library-Backend/target/spring-boot-library-0.0.1-SNAPSHOT.jar` |

---

## Vercel Deployment (Frontend)

The frontend is deployed on Vercel connected to this GitHub repository.

### Required environment variables in Vercel

| Variable | Value |
|----------|-------|
| `REACT_APP_API` | `https://app-649c67ee-012f-4521-8ed7-fcaa608e4d74.cleverapps.io/api` |
| `REACT_APP_AUTH0_AUDIENCE` | `https://app-649c67ee-012f-4521-8ed7-fcaa608e4d74.cleverapps.io` |
