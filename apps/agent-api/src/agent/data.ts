export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface Order {
    id: string;
    customer: string;
    items: string[];
    total: number;
    status: OrderStatus;
    createdAt: string;
}

export const orders: Order[] = [
    {
        id: 'ORD-1001',
        customer: 'Jean Dupont',
        items: ['Clavier mécanique', 'Souris sans fil'],
        total: 129.9,
        status: 'pending',
        createdAt: '2026-10-20',
    },
    {
        id: 'ORD-1002',
        customer: 'Cédric Martin',
        items: ['Écran 27 pouces'],
        total: 249.9,
        status: 'shipped',
        createdAt: '2026-10-19',
    },
    {
        id: 'ORD-1003',
        customer: 'Héléne Dubois',
        items: ['Casque audio'],
        total: 79.9,
        status: 'delivered',
        createdAt: '2026-10-18',
    },
];