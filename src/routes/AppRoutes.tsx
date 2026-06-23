import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { StoreLayout } from '../components/layout/StoreLayout'
import { ProtectedRoute } from './ProtectedRoute'

import { HomePage } from '../pages/HomePage'
import { CatalogPage } from '../pages/CatalogPage'
import { ProductPage } from '../pages/ProductPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { NotFoundPage } from '../pages/NotFoundPage'

import { AccountLayout } from '../pages/account/AccountLayout'
import { AccountDashboardPage } from '../pages/account/AccountDashboardPage'
import { AccountOrdersPage } from '../pages/account/AccountOrdersPage'
import { AccountDownloadsPage } from '../pages/account/AccountDownloadsPage'
import { AccountAddressesPage } from '../pages/account/AccountAddressesPage'
import { AccountNotificationsPage } from '../pages/account/AccountNotificationsPage'
import { AccountSettingsPage } from '../pages/account/AccountSettingsPage'

import { RoleRoute } from './RoleRoute'

import { SellerLayout } from '../pages/seller/SellerLayout'
import { SellerDashboardPage } from '../pages/seller/SellerDashboardPage'
import { SellerProductsPage } from '../pages/seller/SellerProductsPage'
import { SellerProductCreatePage } from '../pages/seller/SellerProductCreatePage'
import { SellerOrdersPage } from '../pages/seller/SellerOrdersPage'
import { SellerFinancePage } from '../pages/seller/SellerFinancePage'
import { SellerMetricsPage } from '../pages/seller/SellerMetricsPage'
import { AdminSellersPage } from '../pages/admin/AdminSellersPage'

import { AdminLayout } from '../pages/admin/AdminLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '../pages/admin/AdminProductsPage'
import { SellerSettingsPage } from '../pages/seller/SellerSettingsPage'
import { AdminFinancePage } from '../pages/admin/AdminFinancePage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { AdminLocalShippingPage } from '../pages/admin/AdminLocalShippingPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/produto/:slug" element={<ProductPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/minha-conta" element={<AccountLayout />}>
              <Route index element={<AccountDashboardPage />} />
              <Route path="pedidos" element={<AccountOrdersPage />} />
              <Route path="downloads" element={<AccountDownloadsPage />} />
              <Route path="enderecos" element={<AccountAddressesPage />} />
              <Route path="notificacoes" element={<AccountNotificationsPage />} />
              <Route path="configuracoes" element={<AccountSettingsPage />} />
            </Route>

            <Route element={<RoleRoute roles={['SELLER']} />}>
              <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboardPage />} />
                <Route path="produtos" element={<SellerProductsPage />} />
                <Route path="produtos/novo" element={<SellerProductCreatePage />} />
                <Route path="configuracoes" element={<SellerSettingsPage />} />
                <Route path="pedidos" element={<SellerOrdersPage />} />
                <Route path="financeiro" element={<SellerFinancePage />} />
                <Route path="metricas" element={<SellerMetricsPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="produtos" element={<AdminProductsPage />} />
                <Route path="sellers" element={<AdminSellersPage />} />
                <Route path="financeiro" element={<AdminFinancePage />} />
                <Route path="configuracoes" element={<AdminSettingsPage />} />
                <Route path="fretes-locais" element={<AdminLocalShippingPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
