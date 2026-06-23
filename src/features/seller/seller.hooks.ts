import { useQuery } from '@tanstack/react-query'
import {
  getSellerDashboard,
  getSellerFinancial,
  getSellerMetrics,
  getSellerProducts
} from './seller.service'

export function useSellerDashboard() {
  return useQuery({
    queryKey: ['seller', 'dashboard'],
    queryFn: getSellerDashboard
  })
}

export function useSellerProducts() {
  return useQuery({
    queryKey: ['seller', 'products'],
    queryFn: getSellerProducts
  })
}

export function useSellerFinancial() {
  return useQuery({
    queryKey: ['seller', 'financial'],
    queryFn: getSellerFinancial
  })
}

export function useSellerMetrics() {
  return useQuery({
    queryKey: ['seller', 'metrics'],
    queryFn: getSellerMetrics
  })
}
