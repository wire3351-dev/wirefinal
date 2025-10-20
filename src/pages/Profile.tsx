import { useMemo, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "@/context/UserAuthContext";
import { getUserProfile, saveUserProfile, UserProfileData } from "@/lib/firebase-services";
import { toast } from "sonner";
import MyOrders from '@/components/MyOrders';
import MyEnquiries from '@/components/MyEnquiries';

const formatContact = (contact: string) => {
  if (/^\S+@\S+\.\S+$/.test(contact)) {
    return contact.toLowerCase();
  }
  const digits = contact.replace(/\D/g, "");
  if (digits.length >= 10) {
    const lastFour = digits.slice(-4);
    return `•••• •••• ${lastFour}`;
  }
  return contact;
};

const Profile = () => {
  const { user, logout } = useUserAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<UserProfileData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    companyName: '',
    businessType: '',
    gstNumber: ''
  });

  const formattedContact = useMemo(() => {
    if (!user) return "";
    return formatContact(user.contact);
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const profileData = await getUserProfile(user.id);
        if (profileData) {
          setProfile(profileData);
          setFormData({
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            address: profileData.address || '',
            city: profileData.city || '',
            state: profileData.state || '',
            pincode: profileData.pincode || '',
            companyName: profileData.companyName || '',
            businessType: profileData.businessType || '',
            gstNumber: profileData.gstNumber || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      await saveUserProfile(user.id, formData);
      setProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
        <div className="container mx-auto px-4 py-24 max-w-xl text-center space-y-6">
          <h1 className="text-3xl font-bold">No active session</h1>
          <p className="text-muted-foreground">
            Please log in or sign up from the header to access your personalized dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">My Profile</CardTitle>
            <CardDescription>Manage your secure, OTP-based account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Verified Contact</h2>
              <p className="mt-2 text-lg font-semibold">{formattedContact}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Last Login</h2>
              <p className="mt-2 text-lg font-semibold">
                {new Date(user.lastLoginAt).toLocaleString()}
              </p>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleChange('businessType', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleChange('gstNumber', e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {profile && (
                  <div className="space-y-3">
                    {profile.fullName && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="text-lg">{profile.fullName}</p>
                      </div>
                    )}
                    {profile.email && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="text-lg">{profile.email}</p>
                      </div>
                    )}
                    {profile.phoneNumber && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                        <p className="text-lg">{profile.phoneNumber}</p>
                      </div>
                    )}
                    {profile.address && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                        <p className="text-lg">{profile.address}</p>
                        {profile.city && profile.state && profile.pincode && (
                          <p className="text-sm text-muted-foreground">
                            {profile.city}, {profile.state} - {profile.pincode}
                          </p>
                        )}
                      </div>
                    )}
                    {profile.companyName && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                        <p className="text-lg">{profile.companyName}</p>
                        {profile.businessType && (
                          <p className="text-sm text-muted-foreground">{profile.businessType}</p>
                        )}
                      </div>
                    )}
                    {profile.gstNumber && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">GST Number</h3>
                        <p className="text-lg">{profile.gstNumber}</p>
                      </div>
                    )}
                  </div>
                )}

                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Activity</h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <MyOrders />
                    <MyEnquiries />
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" onClick={logout} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
