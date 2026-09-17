import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { MenuDetails } from './pages/MenuDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { MyOrders } from './pages/MyOrders';
import { TableReservation } from './pages/TableReservation';
import { MyReservations } from './pages/MyReservations';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Admin Routes & Pages
import { AdminRoute } from './routes/AdminRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminReservations } from './pages/admin/AdminReservations';
import { AdminTables } from './pages/admin/AdminTables';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminSettings } from './pages/admin/AdminSettings';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-dark-900 text-gray-100">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu/:id" element={<MenuDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/reservation" element={<TableReservation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:id"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-reservations"
                  element={
                    <ProtectedRoute>
                      <MyReservations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/menu"
                  element={
                    <AdminRoute>
                      <AdminMenu />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <AdminCategories />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reservations"
                  element={
                    <AdminRoute>
                      <AdminReservations />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/tables"
                  element={
                    <AdminRoute>
                      <AdminTables />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <AdminRoute>
                      <AdminReviews />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <AdminRoute>
                      <AdminCustomers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  }
                />

                {/* Fallback 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="max-w-md mx-auto py-24 text-center">
                      <h2 className="text-3xl font-serif font-bold text-gold-400 mb-2">404 - Page Not Found</h2>
                      <p className="text-gray-400 text-sm">
                        The requested page could not be located in Gotham Restaurant portal.
                      </p>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
