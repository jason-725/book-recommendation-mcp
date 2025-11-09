# Book Recommendation MCP Server

## Overview

The Book Recommendation MCP Server is a Node.js-based application designed to provide book recommendations through a simple Model Context Protocol (MCP) interface. It serves both as an educational example of an MCP server implementation and as a foundation for future expansion into a full-featured recommendation system.

The server includes support for static web hosting via the `public` directory and provides an API endpoint structure that can be extended to include third-party data sources. Future versions will incorporate the Google Books API to enhance recommendations with real-time metadata such as cover images, authors, and descriptions.

---

## Project Objectives

1. Implement a functional and extensible MCP server using Node.js and Express.
2. Provide a minimal and modular codebase for educational or prototyping purposes.
3. Demonstrate integration potential with public APIs, such as Google Books.
4. Enable straightforward deployment to cloud hosting platforms such as Render, Railway, or Vercel.

---

## System Architecture

The server follows a lightweight, modular architecture consisting of the following key components:

- **server.js** – The main application entry point. Initializes Express, defines routes, and serves the frontend.
- **public/** – A static directory containing the client-facing HTML and any supporting frontend assets.
- **.env** – Environment configuration file used to store API keys and other sensitive information.
- **package.json** – Node.js configuration file specifying dependencies, scripts, and metadata.
- **node_modules/** – Automatically generated directory containing project dependencies.

This structure supports the addition of new endpoints and integration layers with minimal refactoring.

---

## Features

- Node.js and Express-based server
- Modular and extendable code design
- Static frontend served from the `/public` directory
- Example API route for fetching book metadata
- Support for environment variable configuration
- Simple deployment workflow for cloud environments

---

## Setup and Installation

### Prerequisites

- Node.js (v18 or later recommended)
- npm (included with Node.js)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/book-recommendation-mcp.git
   cd book-recommendation-mcp
