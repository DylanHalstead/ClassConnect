# 📆 Class Connect

## 🤔 What Does It Do
Class Connect is an scheduling application designed to streamline the process of arranging office hours appointments between students and their Instructional Teams. With a focus on efficiency, customizability, and ease of use, Class Connect provides a user-friendly interface that simplifies the booking process while incorporating features to ensure accountability and reliability. *This was an independant study project done through UNC Charlotte's College of Computing and Informatics*

## 💡 Features
- **Interactive Calendar**: Class Connect includes an interactive, dynamic calendar that allows students to view available office hours and book appointments for any and all classes utilizing the platform.
- **Reputation-Based Restrictions**: Class Connect includes a reputation-based restriction system to manage student behavior, ensuring accountability and reliability when booking office hours.
- **Maximum Office Hours**: When booking appointments, students are limited to a maximum number of office hours per day to ensure fair distribution of time among students.
- **Google Calendar and Meet API Integration**: When booking appointments, Class Connect seemlessly integrates with the Google Calendar and Google Meet API to automatically make calendar invites, ensuring smooth communication and coordination.
- **SSO with Google**: Single Sign-On (SSO) functionality with Google accounts for authentication. Used to also verify that all accounts are UNC Charlotte students.
- **Server Side Rendering**: For enhanced performance and user experience, the application has been built as a full-stack, Server Side Rendered application via [SvelteKit](https://kit.svelte.dev/).

## 🛠️ Local Development
### Postgres
This applaction requires a Postgres database to run. You can set up a local Postgres database with the following command using [Docker](https://docs.docker.com/get-docker/):

```bash
docker run --name class-connect-db -e POSTGRES_PASSWORD=class-connect -p 5432:5432 -d postgres
```
or by [installing Postgres](https://www.postgresql.org/download/) on your local machine.

After setting up your Postgres database, you will need to run the scripts in `schema.sql` to create the necessary tables. You can do so with the following command:

```bash
psql -d <database name> -f schema.sql
```
or by running the scripts in `schema.sql` in your Postgres client.

### SvelteKit
To run and build the application locally, you will need [Node.js](https://nodejs.org/en) installed (Built with v21.7.0; recommend using [nvm](https://github.com/nvm-sh/nvm)).

Once you've installed dependencies from `package.json` with `npm install`, start the development server with:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Enviroment Variables
To run the application locally and connect to DB's and API's, you will need to create a `.env` file in the root directory of the project. You can create a template based on `sample.env`.

Alongside the `.env`, you will also need a `client_secret.json` to connect to Google for SSO and API integrations. You can create a new project and download the `client_secret.json` from [Google Cloud Platform](https://console.cloud.google.com/). *More than likely a Google Cloud project has already been built, speak to Dylan or whoever is maintaining the application.*

## 🚀 Deployment

To create a production version of your app, we utilize [Docker](https://docs.docker.com/get-docker/) to containerize the application. a `Dockerfile` has been built to configure the application and build an image ready for production. You can build the production version of the app with the following command:
```bash
docker build -t class-connect .
```

You can then run the image with the following command:
```bash
docker run -p 3000:3000 class-connect
```

*TODO: add env and client_secret.json to the docker image with args*