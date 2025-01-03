# Expenser

Expenser is an expense tracking application designed to help users manage their personal finances effectively. The application consists of a backend server built with Go and a frontend user interface developed using React, TypeScript, and Vite.

## Features

- **Easy Expense Tracking:** Quickly add, edit, or remove expenses with just a few clicks.
- **Categorized Expenses:** Group expenses into categories (like Food, Transportation, Shopping) for better organization.
- **Analytics & Reports:** View summaries, charts, and expense patterns to analyze your spending habits.
- **Secure Storage:** Data is securely stored so you can track your expenses over time.
- **User Authentication**: Secure login and registration using JWT tokens.

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
- Shadcn/ui
- React Router
- ESLint and Prettier for code styling
- Context API for state management

## Getting Started

### Prerequisites

- [Go](https://golang.org/dl/)
- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/keertirajmalik/expenser.git
   ```

2. **Navigate to the Backend Directory**

   ```bash
   cd expenser-server
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the `expenser-server` directory:

   ```bash
   touch .env
   ```

   Add the following variables to `.env`:

   ```env
   PORT=8080
   DB_URL=postgresql://<username>:<password>@localhost:5432/<database_name>?sslmode=disable
   JWT_SECRET=<your_jwt_secret_key>
   DB_USERNAME=<username>
   DB_PASSWORD=<password>
   DB_DATABASE=<database_name>
   ```

4. **Install Dependencies**

   ```bash
   go mod tidy
   ```

5. **Run Database Migrations**

   ```bash
   # Using psql
   psql -U <username> -d <database_name> -f db/schema/001_init.sql

   # Or using a migration tool like golang-migrate
   @goose postgres "user=${DB_USERNAME} dbname=${DB_DATABASE} sslmode=disable host=localhost password=${DB_PASSWORD}" -dir database/schema up
   ```

  Note: Ensure your database user has sufficient privileges to create tables and indexes.

6. **Start the Server**

   ```bash
   go run main.go
   ```

   The server should now be running on `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd expenser-ui
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

   ```env
   VITE_APP_DEV_BACKEND_URL=http://localhost:8080
   ```

4. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application should now be running on `http://localhost:3000`.

## Usage

1. **Access the Application**
   Once the development server is running, open `http://localhost:3000` in your browser to view the application.

2. **Register a New Account**

   Click on the signup link and create a new user account.

3. **Login**

   Use your credentials to log in to the application.

4. **Manage Transactions**

   - Click on "Add Expense" and fill in details like amount, description, and category.
   - View your transaction history.
   - Update or delete existing transactions.

5. **Manage Categories**

   - Create expense categories according to your needs.
   - View your expense categories.
   - Update or delete existing expense categories.

6. **View Reports**

   Navigate to the "Dashboard" section to get an overview of your expenses by category or date range

## Project Structure

```doc
expenser/
├── expenser-server/       # Backend server code
│   ├── auth/              # Authentication logic
│   ├── database/          # Database configurations and queries
│   ├── internal/          # Internal packages (auth, database models)
|   |   ├── handler/       # routes handlers
|   |   ├── model/         # Data models
|   |   ├── repository/    # DB related code
|   |   └── server/        # server configuration
│   ├── middleware/        # Middleware functions
│   └── main.go            # Entry point of the backend server
└── expenser-ui/           # Frontend client code
    ├── src/
    |   ├── app/           # Application pages
    │   ├── components/    # React components
    │   ├── hooks/         # Hooks
    |   ├── lib/           # utils
    │   ├── providers/     # Context providers
    │   └── types/         # Type definitions
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

Keertiraj Malik - [@keertiraj_malik](https://x.com/keertiraj_malik) - <keertirajmalik@icloud.com>
Project Link: [https://github.com/keertirajmalik/expenser](https://github.com/keertirajmalik/expenser)

Thank you for using Expenser! If you have any questions or suggestions, feel free to open an issue or contact the maintainers of the project.
