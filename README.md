# Expenser

Expenser is an expense tracking application designed to help users manage their personal finances effectively. The application consists of a backend server built with Go and a frontend user interface developed using React, TypeScript, and Vite.

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **Transaction Management**: Create, read, update, and delete transactions.
- **Transaction Types**: Categorize transactions with custom types.
- **Responsive UI**: A modern and responsive interface using Material-UI components.
- **RESTful API**: Structured API endpoints for seamless frontend-backend communication.
- **Database Integration**: Persistent data storage with PostgreSQL.

## Technologies Used

### Backend (`expenser-server`)

- Go (Golang) 1.22
- PostgreSQL
- JWT for authentication (`github.com/golang-jwt/jwt/v5`)
- UUID generation (`github.com/google/uuid`)
- Password hashing (`golang.org/x/crypto`)
- Environment variable management (`github.com/joho/godotenv`)
- CORS handling (`github.com/rs/cors`)
- SQLC for database query generation

### Frontend (`expenser-ui`)

- React 18
- TypeScript
- Vite
- Material-UI
- React Router
- ESLint and Prettier for code styling
- Context API for state management

## Getting Started

### Prerequisites

- Go 1.22 or higher installed
- Node.js and npm installed
- PostgreSQL database setup

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/keertirajmalik/expenser.git
   cd expenser/expenser-server
   ```

2. **Set Up Environment Variables**

   Create a `.env` file in the `expenser-server` directory:

   ```bash
   touch .env
   ```

   Add the following variables to `.env`:

   ```
   PORT=8080
   DB_URL=postgresql://<username>:<password>@localhost:5432/<database_name>?sslmode=disable
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Install Dependencies**

   ```bash
   go mod tidy
   ```

4. **Run Database Migrations**

   Apply the SQL schema files located in `db/schema/` to your PostgreSQL database.

5. **Start the Server**

   ```bash
   go run main.go
   ```

   The server should now be running on `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd ../expenser-ui
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the `expenser-ui` directory:

   ```bash
   touch .env
   ```

   Add the following variable to `.env`:

   ```
   VITE_APP_DEV_BACKEND_URL=http://localhost:8080
   ```

4. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application should now be running on `http://localhost:3000`.

## Usage

1. **Access the Application**

   Open your web browser and navigate to `http://localhost:3000`.

2. **Register a New Account**

   Click on the signup link and create a new user account.

3. **Login**

   Use your credentials to log in to the application.

4. **Manage Transactions**

   - Add new transactions.
   - View your transaction history.
   - Update or delete existing transactions.
   - Create and manage transaction types.

## Project Structure

```
expenser/
├── expenser-server/       # Backend server code
│   ├── db/                # Database configurations and queries
│   ├── handler/           # HTTP handler functions
│   ├── internal/          # Internal packages (auth, database models)
│   ├── middleware/        # Middleware functions
│   ├── model/             # Data models and configurations
│   └── main.go            # Entry point of the backend server
└── expenser-ui/           # Frontend client code
    ├── src/
    │   ├── component/     # React components
    │   ├── modal/         # Modal components
    │   ├── providers/     # Context providers
    │   └── types/         # Type definitions
    ├── public/            # Static assets
    ├── tsconfig.json      # TypeScript configuration
    └── vite.config.ts     # Vite configuration
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Keertiraj Malik - [@keertiraj_malik](https://x.com/keertiraj_malik) - keertirajmalik@icloud.com
Project Link: [https://github.com/keertirajmalik/expenser](https://github.com/keertirajmalik/expenser)
