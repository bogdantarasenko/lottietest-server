# Lottie Files Management Application Server

A comprehensive application designed to manage Lottie animation files with a robust backend, featuring NestJS, GraphQL, MongoDB, and advanced functionalities for a high-quality user experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Design Decisions](#design-decisions)
  - [Backend Framework: NestJS](#backend-framework-nestjs)
  - [Database: MongoDB](#database-mongodb)
  - [Data Querying: GraphQL](#data-querying-graphql)
- [Features and Functionalities](#features-and-functionalities)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project is a comprehensive application designed for the management of Lottie files, leveraging advanced technologies to ensure efficiency, reliability, scalability, and a rich user experience.

## Design Decisions

### Backend Framework: NestJS

Chosen for its scalable architecture, extensive libraries, and support for TypeScript, NestJS facilitates organized code structure and easy scalability.

### Database: MongoDB

A NoSQL database ideal for storing dynamic digital asset data, offering flexibility and scalability.

### Data Querying: GraphQL

Enables efficient data fetching and manipulation, reducing over-fetching and under-fetching issues, with support for caching and offline mode.

## Features and Functionalities

- **Search/Browse Files**: Query animations based on tags and ownership.
- **File Upload**: Users can upload Lottie animation files.
- **File Download**: Users can download animations to their devices.
- **File Delete**: Users can delete their uploaded animations.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

## User credentials for online demo:
email:    johndoe@gmail.com
password: johndoe@gmail.com

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/bogdantarasenko/lottietest-server
cd lottietest-server
npm install
npm run start:dev


