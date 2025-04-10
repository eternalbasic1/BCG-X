# Price Optimization Tool

A comprehensive solution for optimizing product pricing based on demand forecasting and market analysis.

## Overview

This application consists of a Django REST Framework backend and a React frontend. The tool helps businesses optimize their pricing strategies by analyzing historical data, forecasting demand, and suggesting optimal price points to maximize revenue or profit.

## Repository Structure

### Backend

```
price_optimization/
├── manage.py
├── price_optimization/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── api/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── filters.py
│   ├── migrations/
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── services.py
│   ├── urls.py
│   └── views.py
├── authentication/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
└── requirements.txt
```

### Frontend

```
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── store.js
│   │   └── hooks.js
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── product/
│   │   ├── demand-forecast/
│   │   └── pricing-optimization/
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── demand-forecast/
│   │   └── pricing-optimization/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   ├── App.js
│   ├── index.js
│   └── routes.js
├── .env.example
├── package.json
└── README.md
```

## Installation

### Backend Setup

1. **Create a Virtual Environment**

   ```bash
   # Navigate to the backend directory
   cd price_optimization

   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the `price_optimization` directory with the following variables:

   ```
   DEBUG=True
   SECRET_KEY=your_secret_key
   DATABASE_URL=sqlite:///db.sqlite3
   # Add other environment variables as needed
   ```

4. **Run Migrations**

   ```bash
   python manage.py migrate
   ```

5. **Load Seed Data** (Optional)

   ```bash
   python manage.py seed_data
   ```

6. **Create a Superuser** (Optional)

   ```bash
   python manage.py createsuperuser
   ```

7. **Start the Development Server**
   ```bash
   python manage.py runserver
   ```
   The backend API will be available at http://localhost:8000/

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd price_optimization_fe
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**
   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to include:

   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```
   The frontend application will be available at http://localhost:3000/

## Features

- **Authentication System**: Secure user registration and login
- **Product Management**: Add, edit, and delete products
- **Demand Forecasting**: Analyze historical data to predict future demand
- **Price Optimization**: Calculate optimal pricing based on various factors
- **Data Visualization**: Interactive charts and graphs to visualize data and insights

## API Endpoints

The backend exposes several RESTful API endpoints:

- **Authentication**

  - POST `/auth/register/`: Register a new user
  - POST `/auth/login/`: Login and get authentication token
  - POST `/auth/logout/`: Logout and invalidate token

- **Products**

  - GET `/api/products/`: List all products
  - POST `/api/products/`: Create a new product
  - GET `/api/products/{id}/`: Retrieve a specific product
  - PUT `/api/products/{id}/`: Update a product
  - DELETE `/api/products/{id}/`: Delete a product

- **Demand Forecasting**

  - GET `/api/forecast/`: Get demand forecasts
  - POST `/api/forecast/calculate/`: Generate new forecast

- **Price Optimization**
  - GET `/api/optimization/`: Get price optimization results
  - POST `/api/optimization/calculate/`: Calculate optimal prices

## Technologies Used

### Backend

- Django
- Django REST Framework
- PostgreSQL (recommended for production)
- JWT Authentication

### Frontend

- React
- Redux Toolkit
- React Router
- Typescript
- tailwindcss
- recharts.js or similar for visualization

## Deployment

### Backend Deployment

1. Set `DEBUG=False` in production
2. Configure a production-ready database (PostgreSQL recommended)
3. Set up HTTPS
4. Configure CORS settings for your production domain
5. Use a production WSGI server like Gunicorn or uWSGI

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   # or
   yarn build
   ```
2. Deploy the contents of the `build` directory to your web server

## Troubleshooting

Common issues and their solutions:

- **Database connection errors**: Verify your database URL and credentials
- **CORS errors**: Check CORS settings in the backend
- **Authentication issues**: Ensure tokens are being stored and sent correctly
- **API endpoint errors**: Verify API URLs in the frontend configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
