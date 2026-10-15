# 🌱 ESG Reporting System

A full-stack Environmental, Social, and Governance (ESG) Reporting System built using React, Spring Boot, and MySQL. The application helps organizations manage ESG reporting information, track sustainability metrics, submit supporting evidence, and review reporting data.

## 📌 Project Overview

The ESG Reporting System provides a centralized platform for managing sustainability-related information across three pillars:

- **Environmental:** Energy consumption, water usage, waste management, and greenhouse gas emissions.
- **Social:** Employee-related metrics, training, and workforce information.
- **Governance:** Board independence, governance practices, and organizational oversight.

The application organizes reporting information by organization, reporting period, facility, and ESG metric.

## 🛠️ Technology Stack

### Frontend
- React
- JavaScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

### Database
- MySQL

### Development Tools
- Eclipse IDE
- Visual Studio Code
- Git
- GitHub
- Postman

## 📂 Project Structure

```text
esg-project/
│
├── esg-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── esg-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## ✨ Features

### 1. Organization Management
- Create and manage reporting organizations.
- Store organization names, industries, and descriptions.
- Retrieve organization information.

### 2. Reporting Period Management
- Define reporting periods.
- Configure start and end dates.
- Associate reporting periods with organizations.
- Specify reporting boundaries.

### 3. Facility Management
- Register facilities associated with an organization.
- Maintain facility names and locations.

### 4. ESG Metric Management
- Define ESG metrics.
- Categorize metrics into Environmental, Social, and Governance pillars.
- Store metric descriptions, units, formulas, and data sources.
- Specify reporting boundaries and responsible owners.

### 5. Metric Entry Management
- Record ESG metric values.
- Associate entries with metrics, reporting periods, and facilities.
- Store measurement methods, notes, and sources.
- Track data and review statuses.

### 6. Evidence Management
- Maintain evidence metadata associated with metric entries.
- Record file names, file types, file sizes, and upload information.

### 7. Review Management
- Record reviewer decisions and comments.
- Associate reviews with metric entries.
- Maintain review timestamps.

### 8. ESG Reporting Dashboard
- Access ESG reporting sections through a centralized interface.
- Navigate between organizations, facilities, reporting periods, metrics, evidence, reviews, and reports.

## 🏗️ Application Architecture

The application follows a frontend-backend architecture.

```text
                 User
                  |
                  v
       React Frontend (Vite)
          localhost:5173
                  |
                  | HTTP / REST API
                  v
       Spring Boot Backend
          localhost:8081
                  |
                  v
          Spring Data JPA
                  |
                  v
             MySQL Database
           esgreporting_db
```

### Frontend
The React application provides the user interface and communicates with the backend through HTTP requests.

### Backend
The Spring Boot application exposes REST APIs and processes requests using application logic, entities, repositories, and services.

### Database
MySQL stores the application's persistent data. Spring Data JPA and Hibernate manage database interactions.

## ⚙️ Prerequisites

Install the following software before running the application:

- Java 21
- Maven
- Node.js and npm
- MySQL Server
- Git

## 🚀 Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/hd-111/esg-project.git
```

Navigate into the project directory:

```bash
cd esg-project
```

### Step 2: Configure the MySQL Database

Start MySQL and create the database:

```sql
CREATE DATABASE esgreporting_db;
```

Configure the database connection in the backend's `application.properties`.

Example:

```properties
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/esgreporting_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Set `DB_USERNAME` and `DB_PASSWORD` to your local MySQL credentials.

**Security note:** Never commit actual database passwords, API keys, or other secrets to GitHub.

### Step 3: Run the Backend

Open a terminal and navigate to the backend directory:

```bash
cd esg-backend
```

Run the application using Maven:

```bash
mvn spring-boot:run
```

The backend should be available at:

```text
http://localhost:8081
```

The application requires a running MySQL server and valid database configuration.

### Step 4: Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd esg-frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local address printed by Vite, typically:

```text
http://localhost:5173
```

Ensure the frontend API configuration points to the running backend.

## 🔌 API Overview

The backend exposes REST endpoints for the following resources:

| Resource | Base Endpoint | Purpose |
|---|---|---|
| Organizations | `/api/organizations` | Manage organizations |
| Reporting Periods | `/api/reporting-periods` | Manage reporting periods |
| Facilities | `/api/facilities` | Manage facilities |
| Metric Definitions | `/api/metric-definitions` | Manage ESG metric definitions |
| Metric Entries | `/api/metric-entries` | Manage metric records |
| Evidence | `/api/evidence` | Manage evidence metadata |
| Reviews | `/api/reviews` | Manage reviews |

The API base URL during local development is:

```text
http://localhost:8081/api
```

Available HTTP methods and request formats depend on the implemented backend controllers.

## 🧪 Testing

### Backend
- Test API endpoints using Postman.
- Verify database connectivity.
- Test organization, facility, reporting period, metric, evidence, and review operations.

### Frontend
- Run the development server.
- Verify page navigation.
- Test forms and API integration.
- Confirm that the frontend displays backend responses correctly.

## 🔒 Security Considerations

- Store credentials in environment variables rather than committing them to source control.
- Do not expose database passwords in public repositories.
- Configure appropriate CORS settings.
- Apply authentication and authorization appropriate to the deployment environment.
- Validate incoming API requests.

## 🔮 Future Enhancements

Potential future enhancements include:

- ESG metric calculations and carbon-emission factor management.
- Advanced dashboard visualizations.
- Exportable PDF and Word reports.
- Detailed reporting history and revision tracking.
- Role-based access control.
- Automated testing and continuous integration.
- Cloud deployment.
- Improved evidence file storage and retrieval.

These enhancements depend on the application's implementation and requirements.

## 👨‍💻 Developer

**Harshith D.**

GitHub: [hd-111](https://github.com/hd-111)

## 📄 License

This project was developed for educational and project-assignment purposes. A formal open-source license can be added if required.
