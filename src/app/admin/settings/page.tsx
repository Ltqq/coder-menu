
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Settings | Admin',
  description: 'Configure application settings.',
};

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage application settings and configurations. (Placeholder)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Settings configuration options will appear here.</p>
        {/* Add actual settings form elements later */}
      </CardContent>
    </Card>
  );
}
