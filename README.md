# EcoFinds - Sustainable Marketplace

EcoFinds is a full-stack web application that connects eco-conscious buyers and sellers. This platform allows users to list and browse second-hand products, promoting sustainability and reducing waste.

![EcoFinds Logo](https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600)

## Features

### User Authentication
- User registration and login
- Profile management
- Secure password hashing
- Session-based authentication

### Product Management
- Create product listings with detailed information
- Upload product images (placeholder in current version)
- Edit and delete your own listings
- Mark products as favorites
- Browse products with filtering options

### Search and Filtering
- Search products by keyword
- Filter by category
- Filter by price range
- Filter by condition
- Filter by eco certifications

### User Interface
- Responsive design that works on mobile, tablet, and desktop
- Clean, modern interface with a focus on usability
- Easy navigation between sections

## Technology Stack

### Frontend
- React.js
- TypeScript
- TailwindCSS
- shadcn/ui component library
- React Query for data fetching

### Backend
- Node.js with Express
- PostgreSQL database
- Drizzle ORM
- Session-based authentication

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ecofinds.git
   cd ecofinds
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   - Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/ecofinds
   SESSION_SECRET=your-secret-key
   ```

4. Set up the database
   ```bash
   npm run db:push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Access the application at http://localhost:5000

## Project Structure

```
ecofinds/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main application component
├── server/              # Backend Express server
│   ├── auth.ts          # Authentication logic
│   ├── db.ts            # Database configuration
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database access layer
├── shared/              # Shared code between client and server
│   └── schema.ts        # Database schema and types
└── package.json         # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `POST /api/logout` - Logout current user
- `GET /api/user` - Get current user info

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product listing
- `PUT /api/products/:id` - Update a product listing
- `DELETE /api/products/:id` - Delete a product listing

### Favorites
- `GET /api/favorites` - Get user's favorite products
- `POST /api/favorites/:productId` - Add a product to favorites
- `DELETE /api/favorites/:productId` - Remove a product from favorites

### Categories
- `GET /api/categories` - Get all product categories

## Future Enhancements

### User Experience
- Real-time chat between buyers and sellers
- User ratings and reviews
- Enhanced product search with AI-powered recommendations
- Social sharing integration

### E-commerce Features
- Secure payment processing
- Order management
- Shipping and delivery tracking
- Discount codes and promotions

### Sustainability Features
- Carbon footprint calculation for each transaction
- Community challenges and sustainability goals
- Educational resources on sustainable living
- Integration with recycling and donation services

### Technical Improvements
- Implement robust image handling with cloud storage
- Add comprehensive test coverage
- Create mobile applications using React Native
- Implement serverless functions for specific tasks

## Contributing

We welcome contributions to EcoFinds! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the open-source projects that made this possible
- The sustainable community for inspiration
- Icons provided by Lucide React