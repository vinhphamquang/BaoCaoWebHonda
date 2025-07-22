import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CarDetail from './CarDetail';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: { params: { id: Promise<string> } }): Promise<Metadata> {
  // Sử dụng await để lấy id từ params
  const id = await params.id;
  
  return {
    title: 'Car Details | Honda Plus',
    description: 'View details for this car',
  };
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  return <CarDetail id={params.id} />;
}
