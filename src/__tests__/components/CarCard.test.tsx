import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CarCard from '@/components/cars/CarCard'

// Mock car data
const mockCar = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Honda Civic 2024',
  model: 'Civic',
  price: 730000000,
  category: 'sedan' as const,
  year: 2024,
  color: 'Trắng Ngọc Trai',
  images: ['/images/honda-civic-2024.jpg'],
  specifications: {
    engine: '1.5L VTEC Turbo',
    transmission: 'CVT',
    fuelType: 'Xăng',
    seating: 5,
    mileage: '6.5L/100km',
    safety: ['Honda SENSING', '6 túi khí'],
    features: ['Màn hình cảm ứng', 'Apple CarPlay'],
  },
  description: 'Honda Civic 2024 - Xe Honda chính hãng với thiết kế hiện đại',
  isAvailable: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Simple wrapper component for tests
const CarCardWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

describe('CarCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders car information correctly', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    expect(screen.getByText('Honda Civic 2024')).toBeInTheDocument()
    expect(screen.getByText('Trắng Ngọc Trai')).toBeInTheDocument()
    expect(screen.getByText('1.5L VTEC Turbo')).toBeInTheDocument()
    expect(screen.getByText('Xăng')).toBeInTheDocument()
    expect(screen.getByText('730.000.000 ₫')).toBeInTheDocument()
  })

  it('displays category badge', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    expect(screen.getByText('SEDAN')).toBeInTheDocument()
  })

  it('displays year information', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('shows availability badge when car is available', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    expect(screen.getByText('✨ CÓ SẴN')).toBeInTheDocument()
  })

  it('does not show availability badge when car is not available', () => {
    const unavailableCar = { ...mockCar, isAvailable: false }
    
    render(
      <CarCardWrapper>
        <CarCard car={unavailableCar} />
      </CarCardWrapper>
    )

    expect(screen.queryByText('✨ CÓ SẴN')).not.toBeInTheDocument()
  })

  it('has view details button', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    expect(screen.getByText('Xem chi tiết')).toBeInTheDocument()
  })

  it('has contact button', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    const contactButton = screen.getByRole('button', { name: /liên hệ/i })
    expect(contactButton).toBeInTheDocument()
  })

  it('applies hover effects on card', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    const card = screen.getByRole('article')
    expect(card).toHaveClass('card-hover')
  })

  it('renders with grid view mode by default', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    const card = screen.getByRole('article')
    expect(card).toBeInTheDocument()
  })

  it('renders with list view mode when specified', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} viewMode="list" />
      </CarCardWrapper>
    )

    const card = screen.getByRole('article')
    expect(card).toBeInTheDocument()
  })

  it('formats price correctly', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    // Check if price is formatted with Vietnamese currency
    expect(screen.getByText('730.000.000 ₫')).toBeInTheDocument()
  })

  it('displays engine and fuel type specifications', () => {
    render(
      <CarCardWrapper>
        <CarCard car={mockCar} />
      </CarCardWrapper>
    )

    expect(screen.getByText('🚗')).toBeInTheDocument()
    expect(screen.getByText('⛽')).toBeInTheDocument()
    expect(screen.getByText('1.5L VTEC Turbo')).toBeInTheDocument()
    expect(screen.getByText('Xăng')).toBeInTheDocument()
  })
})
