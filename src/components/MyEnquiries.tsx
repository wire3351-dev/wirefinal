import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserAuth } from '@/context/UserAuthContext';
import { formatDistanceToNow } from 'date-fns';

const MyEnquiries: React.FC = () => {
  const { user } = useUserAuth();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const uid = user?.id || (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null);

  useEffect(() => {
    setIsLoading(true);

    const load = async () => {
      try {
        const token = await (async () => {
          try {
            if (typeof window === 'undefined') return null;
            return window.localStorage.getItem('firebase_id_token');
          } catch (e) {
            return null;
          }
        })();
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const resp = await fetch(`/api/enquiries${token ? '' : `?userId=${encodeURIComponent(uid || '')}`}`, { headers });
        if (resp.ok) {
          const data = await resp.json();
          setItems(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to load enquiries', await resp.text());
          setItems([]);
        }
      } catch (e) {
        console.error('Error loading enquiries', e);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) load();
    else {
      setItems([]);
      setIsLoading(false);
    }
  }, [uid]);

  if (isLoading) return <p>Loading enquiries...</p>;

  if (!items || items.length === 0) {
    return <p>No previous enquiries</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Enquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enquiry ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status/Reply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.id}</TableCell>
                <TableCell>{it.productName || it.userType || it.location || '—'}</TableCell>
                <TableCell>{it.createdAt ? formatDistanceToNow(new Date(it.createdAt), { addSuffix: true }) : '—'}</TableCell>
                <TableCell>{it.status || it.reply || 'Pending'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MyEnquiries;
