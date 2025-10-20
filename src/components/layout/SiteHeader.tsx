import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Inquiry", to: "/inquiry" },
  { label: "My Orders", to: "/orders" },
  { label: "Owner Dashboard", to: "/owner" },
  { label: "About Us", to: "/about-us" },
  { label: "Return & Shipping", to: "/return-shipping-policy" },
] as const;

const isValidEmail = (value: string) => {
  return /^(?:[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/u.test(value.trim());
};

const isValidPhone = (value: string) => {
  // Indian phone number: 10 digits starting with 6-9
  return /^[6-9]\d{9}$/.test(value.trim().replace(/[\s-]/g, ''));
};

const SiteHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contactValue, setContactValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, requestOtp, verifyOtp } = useUserAuth();

  const isContactValid = useMemo(() => {
    if (!contactValue.trim()) return false;
    return isValidEmail(contactValue) || isValidPhone(contactValue);
  }, [contactValue]);

  const resetDialogState = () => {
    setContactValue("");
    setOtpValue("");
    setIsOtpSent(false);
    setIsRequesting(false);
    setIsVerifying(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      resetDialogState();
      return;
    }
    setIsDialogOpen(true);
  };

  const handleSendOtp = async () => {
    if (!isContactValid) {
      toast.error("Enter a valid mobile number or email address.");
      return;
    }

    try {
      setIsRequesting(true);
      await requestOtp(contactValue);
      setIsOtpSent(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send OTP right now.";
      toast.error(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      await verifyOtp(contactValue, otpValue);
      setIsDialogOpen(false);
      resetDialogState();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed. Please try again.";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-12 md:h-16 items-center justify-between gap-3 md:gap-6 px-3 md:px-4">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                          isActive ? "text-primary" : "text-foreground",
                        )
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-4">
                  {!isAuthenticated ? (
                    <Button className="w-full" onClick={() => { setIsMenuOpen(false); setIsDialogOpen(true); }}>Login / Sign Up</Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Link to="/profile">My Profile</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex items-center gap-2 text-base md:text-lg font-semibold">
            <img src="/WireBazaar.jpg" alt="WireBazaar" className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover" />
            <span>WireBazaar</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {!isAuthenticated ? (
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="whitespace-nowrap">
                Login / Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Secure Login</DialogTitle>
                <DialogDescription>
                  Enter your mobile number or email to receive a one-time password for safe access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Input
                    placeholder="Mobile Number or Email"
                    inputMode="email"
                    value={contactValue}
                    onChange={(event) => setContactValue(event.target.value)}
                    disabled={isRequesting || isVerifying}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSendOtp}
                    disabled={!isContactValid || isRequesting}
                  >
                    {isRequesting ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter OTP"
                    inputMode="numeric"
                    value={otpValue}
                    onChange={(event) => setOtpValue(event.target.value)}
                    maxLength={6}
                    disabled={!isOtpSent || isVerifying}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleVerifyOtp}
                    disabled={!isOtpSent || otpValue.trim().length !== 6 || isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Verify & Login"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button asChild size="sm" variant="outline" className="whitespace-nowrap">
            <Link to="/profile">My Profile</Link>
          </Button>
        )}
      </div>
      <div aria-hidden="true" className="h-px bg-foreground/50" />
    </header>
  );
};

export default SiteHeader;
