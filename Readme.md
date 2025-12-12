# 🌌 VartaVerse: A Microservices-Based Media Review & Social Platform

**VartaVerse** is a modern, full-stack social platform focused on **media content review and community interaction**. Engineered using a **Microservices Architecture**, the system ensures high scalability, clear separation of concerns, and independent deployment of core business functionalities.

This documentation serves as a comprehensive guide for developers looking to understand the architecture, environment setup, and core APIs of the VartaVerse project.

---

## ✨ Project Overview & Core Capabilities

VartaVerse separates its domain logic into two primary microservices, facilitating agility and robust performance under load:

| Service Name | Core Focus | Key Responsibilities | Database Schema Coverage |
| :--- | :--- | :--- | :--- |
| **User & Admin Management Service** | **Identity, Security, & Community** | User Registration/Auth (JWT), Profile Management, Following/Followers, Admin Moderation & Logging. | `users`, `followers`, `password_resets`, `admin_logs` |
| **Content & Interaction Management Service** | **Content Lifecycle & Engagement** | Post CRUD, Rating Aggregation, Likes, Comments, Trending Logic, Post Search/Filtering. | `posts`, `comments`, `likes`, `ratings`, `reports`, `trending_cache` |

---

## 🛠️ Technology Stack

| Category | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Backend Framework** | **Spring Boot** (Java) | Developing robust, production-ready RESTful microservices. |
| **Frontend** | **React** | Dynamic and responsive Single Page Application (SPA). |
| **Data Persistence** | **MySQL** | Reliable, ACID-compliant relational storage for core user and content data. |
| **Security** | **JWT (JSON Web Tokens)** | Stateless authentication and authorization across microservices. |
| **Containerization** | **Docker & Docker Compose** | Defining and running the multi-container application locally and in production. |
| **Version Control** | **Git** | Managing code history and collaborative development. |
| **API Contract** | **Swagger/OpenAPI** | Formal definition of the API structure (`VartaVerse.json`). |

---

## 🚀 Getting Started (Local Development Setup)

To run the full VartaVerse stack, you will need **Docker** and **Docker Compose** installed. This ensures a consistent environment for all services and databases.

### Prerequisites

* Docker Engine & Docker Compose
* Git

### 1. Repository Clone & Setup

```bash
# Clone the repository
git clone <repository_url> VartaVerse
cd VartaVerse
````

### 2\. Full Stack Deployment (Docker Compose)

The `docker-compose.yml` file handles the construction and networking of all components: two Spring Boot microservices, the React client, and the dedicated MySQL database.

1.  **Build Images:**
    This command compiles the Spring Boot services (creates JARs) and builds the necessary Docker images.

    ```bash
    docker compose build
    ```

2.  **Start Services:**
    This runs all services and the MySQL database in detached mode (`-d`).

    ```bash
    docker compose up -d
    ```

| Component | Access URL | Port | Notes |
| :--- | :--- | :--- | :--- |
| **React Frontend** | `http://localhost:3000` | 3000 | User interface for interaction. |
| **User & Admin Management Service** | `http://localhost:8081` | 8081 | Handles user-centric APIs. |
| **Content & Interaction Service** | `http://localhost:8082` | 8082 | Handles post, comment, and like APIs. |
| **MySQL Database** | N/A (Internal) | 3306 | Single database instance for simplified local setup. |

3.  **Stopping & Cleanup:**
    To stop and remove all running containers and volumes:
    ```bash
    docker compose down -v
    ```

-----

## 🔑 Key API Endpoints (Service Breakdown)

The service separation ensures clear ownership of data and functionality. All endpoints require **JWT Authorization** unless explicitly stated as public (e.g., `/register`, `/login`).

### I. User & Admin Management Service (`http://localhost:8081/users/`)

This service manages the identity lifecycle and community structure.

| Endpoint | Method | Description | Security |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | Registers a new user account. | Public |
| `/login` | `POST` | Authenticates user and returns **JWT token**. | Public |
| `/profile/{userId}` | `GET/PUT` | Fetch or update user profile details. | Secured |
| `/follow/{targetId}` | `POST` | Initiates following another user. | Secured |
| `/followers/{userId}` | `GET` | Retrieves the list of followers for a user. | Secured |
| `/admin/dashboard` | `GET` | Analytics and management view for Admins. | Admin Role Secured |
| `/admin/users/{userId}` | `DELETE` | Admin action to remove or ban a user. | Admin Role Secured |

### II. Content & Interaction Management Service (`http://localhost:8082/posts/`)

This service handles all content creation, engagement metrics, and discovery.

| Endpoint | Method | Description | Security |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Creates a new media review or content post. | Secured |
| `/{postId}` | `PUT/DELETE` | Edit or delete a specific post. | Secured (Author/Admin) |
| `/{postId}/like` | `POST` | Toggles a like on a post. | Secured |
| `/{postId}/comment` | `POST` | Adds a comment to a post. | Secured |
| `/{postId}/rate` | `POST` | Submits a 1-5 star rating for a post. | Secured |
| `/trending` | `GET` | Fetches posts based on calculated engagement score. | Public/Secured |
| `/search?query=` | `GET` | Searches posts and users by keyword. | Public/Secured |

-----

## 🗃️ Database Schema

All services rely on a single, consolidated MySQL instance for local deployment, though tables are logically owned by their respective microservices.

| Table Name | Owner Service | Description | Key Foreign Key Relationships |
| :--- | :--- | :--- | :--- |
| `users` | User Service | User core information, roles, and credentials. | - |
| `followers` | User Service | Records the follow/following relationship. | `follower_id` $\rightarrow$ ` users(user_id)$ | |  `posts`| Content Service | Main content (reviews, news), category, and title. |`user\_id`$\rightarrow$`users(user\_id)$ |
| `comments` | Content Service | User text submissions on posts. | `post_id` $\rightarrow$ ` posts(post_id)$ ,  `user\_id`$\rightarrow$`users(user\_id)$ |
| `ratings` | Content Service | Individual star ratings (1-5) used to calculate `rating_avg`. | `post_id` $\rightarrow$ ` posts(post_id)$ ,  `user\_id`$\rightarrow$`users(user\_id)$ |
| `trending_cache` | Content Service | Lightweight table for quick retrieval of trending posts. | `post_id` $\rightarrow$ \`posts(post\_id)$ |

---



## 📜 License
This project is licensed under the MIT License. See the LICENSE file in the root directory for details.