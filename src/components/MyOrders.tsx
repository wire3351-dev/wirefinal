import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserAuth } from '@/context/UserAuthContext';
import { format } from 'date-fns';

const MyOrders: React.FC = () => {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const uid = user?.id || (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null);

  useEffect(() => {
    setIsLoading(true);

    const load = async () => {
      try {
        const headers: any = {};
        // send id token if available
        const token = await (async () => {
          try {
            if (typeof window === 'undefined') return null;
            return window.localStorage.getItem('firebase_id_token');
          } catch (e) {
            return null;
          }
        })();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const resp = await fetch(`/api/orders${token ? '' : `?userId=${encodeURIComponent(uid || '')}`}`, { headers });
        if (resp.ok) {
          const data = await resp.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to load orders', await resp.text());
          setOrders([]);
        }
      } catch (e) {
        console.error('Error loading orders', e);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) load();
    else {
      setOrders([]);
      setIsLoading(false);
    }
  }, [uid]);

  if (isLoading) return <p>Loading orders...</p>;

  if (!orders || orders.length === 0) {
    return <p>No previous orders found</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.orderNumber || o.id}</TableCell>
                <TableCell>{o.createdAt ? format(new Date(o.createdAt), 'PPP') : '—'}</TableCell>
                <TableCell>{Array.isArray(o.items) ? o.items.length : (o.items?.length || 0)}</TableCell>
                <TableCell>₹{(o.totalAmount ?? o.total)?.toFixed ? (o.totalAmount ?? o.total).toFixed(2) : (o.totalAmount ?? o.total)}</TableCell>
                <TableCell>{o.status || o.paymentStatus || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MyOrders;
