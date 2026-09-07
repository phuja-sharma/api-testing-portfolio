# Warung Kasir API Testing Portfolio

Automated API testing suite for the **Warung Kasir** backend services. Built using Postman and Newman, integrated with GitHub Actions to perform continuous integration testing against ephemeral environments (Railway).

---

## Overview

This repository demonstrates an end-to-end API automation test architecture designed to handle dynamic data lifecycles and ephemeral state dependencies without reliance on static database states.

### Key Highlights
- **Dynamic State Management:** Eliminates hardcoded IDs by capturing and passing environment variables (`catId`, `productId`, `transactionId`) dynamically across sequential requests.
- **CI/CD Integration:** Automated test execution via Newman CLI on every push to the `main` branch.
- **Known Bug Tracking:** Includes edge-case assertions designed to catch backend logic inconsistencies.

---

## Test Execution Order (Data Lifecycle)

To prevent cascading failures (404/400) in isolated environments, test scripts follow a strict CRUD lifecycle order:

1. POST Create Category (Temp)    --> Extracts {{catIdDelete}}
2. DELETE Category (Temp)         --> Verifies deletion logic
3. POST Create Category (Main)    --> Extracts {{catId}}
4. POST Add New Product           --> Binds to {{catId}}, extracts {{productId}}
5. GET Product / PUT Product      --> Validates resource state using {{productId}}
6. POST Checkout Transaction      --> Uses {{productId}}, extracts {{transactionId}}
7. DELETE Cancel Transaction      --> Cancels transaction using {{transactionId}}
8. DELETE Product                 --> Cleans up {{productId}}
9. DELETE Category (Main)         --> Cleans up {{catId}}

---

## Known Backend Issue

During test suite construction, an architectural bug was identified in the target backend service:

| Field | Description |
|---|---|
| **Endpoint** | `POST /api/categories` |
| **Expected Behavior** | Returns `400 Bad Request` or `409 Conflict` when creating a duplicate category name. |
| **Actual Behavior** | Returns `200 OK` and creates a duplicate record. |
| **Status** | Logged in Bug Report / Handled in assertion logic. |

---

## Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- Postman Desktop or Newman CLI

### Run via Newman CLI

1. Clone the repository:
   git clone https://github.com/phuja-sharma/api-testing-portfolio.git
   cd api-testing-portfolio

2. Install dependencies:
   npm install -g newman

3. Execute the test collection:
   newman run "Test Warung-Kasir.postman_collection.json" -e "Warung-Kasir-Environment.postman_environment.json"

---

## Tech Stack

- **API Testing:** Postman, Postman Collection Runner
- **CLI Runner:** Newman CLI
- **CI/CD:** GitHub Actions
- **Target Backend:** Express.js / Node.js
