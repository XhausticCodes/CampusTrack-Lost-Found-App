# Campus Lost & Found Management System

A comprehensive **Lost & Found Management System** designed for campuses to help students and administrators efficiently manage lost and found items. This full-stack application features intelligent fuzzy matching, real-time chat, role-based access control, and an intuitive user interface.

![Tech Stack](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen) ![Java](https://img.shields.io/badge/Java-17-orange) ![React](https://img.shields.io/badge/React-19-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Fuzzy Matching Logic](#-fuzzy-matching-algorithm)

---

## ✨ Features

### Core Functionality

- **Lost Item Management**: Submit, track, and manage lost items with detailed metadata
- **Found Item Management**: Report found items and track their status
- **Intelligent Matching**: Fuzzy logic algorithm matches lost and found items based on multiple attributes
- **Advanced Search**: Query items using fuzzy search across name, brand, color, category, and location
- **Item Status Tracking**: Mark items as found/claimed with real-time status updates

### User Experience

- **Role-Based Access**: Separate interfaces for Students and Admins
- **Real-Time Chat**: WebSocket-powered messaging system for communication
- **Responsive UI**: Modern interface built with React, Tailwind CSS, and Bootstrap
- **Theme Support**: Dark/Light mode toggle for personalized experience
- **Image Support**: Upload and display images for lost/found items
- **User Profiles**: Manage personal information and view submission history

### Admin Features

- **Student Management**: View and manage student accounts
- **System Reports**: Access comprehensive lost and found reports
- **Global Oversight**: Monitor all items across the campus

---

## 🛠 Tech Stack

### Backend

- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security
- **WebSocket**: Spring WebSocket (STOMP) for real-time chat
- **ORM**: Spring Data JPA / Hibernate
- **Matching Algorithm**: Apache Commons Text (Jaro-Winkler Similarity)

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4, Bootstrap 5
- **HTTP Client**: Axios
- **WebSocket Client**: SockJS, STOMP.js
- **Animations**: GSAP 3
- **Icons**: Lucide React, React Icons

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │   Services   │  │   Context    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    REST API + WebSocket                       │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    Backend (Spring Boot)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │   Services   │  │     DAO      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         │                  │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Beans     │  │ Fuzzy Logic  │  │  WebSocket   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                            │                                 │
│                       Spring Security                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   MySQL 8.0     │
                    └─────────────────┘
```

---

## 📦 Prerequisites

### Backend

- **Java**: JDK 17 or higher
- **Maven**: 3.8+
- **MySQL**: 8.0 or higher
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code (recommended)

### Frontend

- **Node.js**: 18+
- **npm**: 9+
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone "github.com/XhausticCodes/CampusTrack-Lost-Found-App"
cd InfosysProject
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd CampusManagement-backend/lostAndFoundApplication
```

#### Configure MySQL Database

Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusdb?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Build and Run

```bash
# Using Maven wrapper
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or using Maven directly
mvn clean install
mvn spring-boot:run
```

The backend server will start on **http://localhost:9999**

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd CampusManagement-frontend/LostAndFoundApp-Frontend-main
```

#### Install Dependencies

```bash
npm install
```

#### Configure API Base URL

Update the backend URL in `src/Services/LoginService.jsx` and `src/Services/ItemService.jsx` if needed:

```javascript
const BASE_URL = "http://localhost:9999/lost-found";
```

#### Start Development Server

```bash
npm run dev
```

The frontend will be available at **http://localhost:3939**

---

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

```properties
# Server Configuration
spring.application.name=lostAndFoundApplication
server.port=9999

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campusdb?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Frontend Configuration

- **Development Server Port**: 3939 (configurable in `vite.config.js`)
- **WebSocket Endpoint**: `ws://localhost:9999/ws`
- **API Endpoint**: `http://localhost:9999/lost-found`

---

## 🎯 Usage

### For Students

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Report Lost Item**: Submit details including name, category, brand, color, location, and image
3. **Track Lost Items**: Monitor the status of your reported items and view matches
4. **Report Found Item**: Report items you've found on campus
5. **Search Items**: Use the fuzzy search to find items that might match yours
6. **Chat**: Communicate with other users through the real-time chat feature
7. **Mark as Found**: Claim your found items when successfully matched

### For Admins

1. **Admin Dashboard**: Access comprehensive system overview
2. **Manage Students**: View and manage all student accounts
3. **System Reports**: Generate reports for all lost and found items
4. **Oversight**: Monitor all campus items and facilitate matches

---

## 📚 API Documentation

### Authentication Endpoints

- `POST /lost-found/auth/register` - Register new user
- `POST /lost-found/auth/login` - User login
- `POST /lost-found/auth/logout` - User logout
- `GET /lost-found/auth/user` - Get current user details

### Lost Items Endpoints

- `POST /lost-found/lost-items` - Create lost item
- `GET /lost-found/lost-items` - Get all lost items
- `GET /lost-found/lost-items/{id}` - Get lost item by ID
- `GET /lost-found/lost-items/user` - Get user's lost items
- `DELETE /lost-found/lost-items/{id}` - Delete lost item

### Found Items Endpoints

- `POST /lost-found/found-items` - Create found item
- `GET /lost-found/found-items` - Get all found items
- `GET /lost-found/found-items/{id}` - Get found item by ID
- `GET /lost-found/found-items/user` - Get user's found items
- `DELETE /lost-found/found-items/{id}` - Delete found item

### Fuzzy Logic Endpoints

- `GET /lost-found/fuzzy/match-found/{lostItemId}` - Match lost item with found items
- `GET /lost-found/fuzzy/match-lost/{foundItemId}` - Match found item with lost items
- `GET /lost-found/fuzzy/search-found` - Search found items
- `GET /lost-found/fuzzy/search-lost` - Search lost items

### WebSocket Endpoints

- `ws://localhost:9999/ws` - WebSocket connection endpoint
- `/app/message` - Send message
- `/topic/public` - Public message broadcast
- `/user/{username}/queue/messages` - Private messages

---

## 📁 Project Structure

```
InfosysProject/
├── CampusManagement-backend/
│   └── lostAndFoundApplication/
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       │   └── edu/infosys/lostAndFoundApplication/
│       │       │       ├── bean/               # JPA Entities
│       │       │       │   ├── LostItem.java
│       │       │       │   ├── FoundItem.java
│       │       │       │   └── CampusUser.java
│       │       │       ├── controller/         # REST Controllers
│       │       │       │   ├── LostItemController.java
│       │       │       │   ├── FoundItemController.java
│       │       │       │   ├── LoginController.java
│       │       │       │   ├── FuzzyLogicController.java
│       │       │       │   └── ChatController.java
│       │       │       ├── service/            # Business Logic
│       │       │       │   ├── LostItemService.java
│       │       │       │   ├── FoundItemService.java
│       │       │       │   ├── CampusUserService.java
│       │       │       │   └── FuzzyLogic.java
│       │       │       ├── dao/                # Data Access Layer
│       │       │       │   ├── LostItemRepository.java
│       │       │       │   ├── FoundItemRepository.java
│       │       │       │   └── CampusUserRepository.java
│       │       │       ├── config/             # Configuration
│       │       │       │   ├── WebSocketConfig.java
│       │       │       │   └── SystemConfig.java
│       │       │       └── chat/               # WebSocket Handlers
│       │       │           └── ChatController.java
│       │       └── resources/
│       │           └── application.properties
│       ├── pom.xml
│       └── mvnw
│
├── CampusManagement-frontend/
│   └── LostAndFoundApp-Frontend-main/
│       ├── src/
│       │   ├── Auth/                           # Authentication
│       │   │   ├── Signin/
│       │   │   ├── Signup/
│       │   │   └── ProtectedRoute.jsx
│       │   ├── Components/                     # React Components
│       │   │   ├── Dashboard/
│       │   │   │   ├── AdminMenu.jsx
│       │   │   │   └── StudentMenu.jsx
│       │   │   ├── LostItem/
│       │   │   ├── FoundItem/
│       │   │   ├── Buttons/
│       │   │   ├── Profile.jsx
│       │   │   ├── ChatPage.jsx
│       │   │   └── NotFound.jsx
│       │   ├── Context/                        # React Context
│       │   │   ├── ThemeContext.jsx
│       │   │   └── WebSocketContext.jsx
│       │   ├── Services/                       # API Services
│       │   │   ├── LoginService.jsx
│       │   │   └── ItemService.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       ├── vite.config.js
│       └── eslint.config.js
│
└── README.md
```

---

## 🔍 Fuzzy Matching Algorithm

The system uses a sophisticated fuzzy matching algorithm based on **Jaro-Winkler Similarity** to match lost and found items.

### Matching Criteria

The algorithm considers four key attributes with weighted scoring:

| Attribute     | Weight | Description                     |
| ------------- | ------ | ------------------------------- |
| **Item Name** | 50%    | Primary identifier for the item |
| **Brand**     | 25%    | Manufacturer or brand name      |
| **Color**     | 15%    | Item color                      |
| **Category**  | 10%    | Item category/type              |

### Thresholds

- **Minimum Item Name Similarity**: 0.6 (60%)
- **Item Name Threshold**: 0.6 (60%)
- **Attribute Threshold**: 0.85 (85%)

### Features

- **Bidirectional Matching**: Find matches for both lost and found items
- **Intelligent Normalization**: Case-insensitive matching with whitespace handling
- **Substring Detection**: Identifies partial matches efficiently
- **Ranked Results**: Returns matches sorted by relevance score
