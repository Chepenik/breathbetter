// Premium feature management

// Check if premium is active
export function isPremiumActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  const premiumCode = localStorage.getItem('breathBetterPremiumCode');
  const premiumExpiry = localStorage.getItem('breathBetterPremiumExpiry');
  
  if (!premiumCode || !premiumExpiry) return false;
  
  // Check if premium has expired
  const expiryDate = new Date(premiumExpiry);
  if (expiryDate < new Date()) {
    // Premium expired
    localStorage.removeItem('breathBetterPremiumCode');
    localStorage.removeItem('breathBetterPremiumExpiry');
    return false;
  }
  
  return true;
}

// Activate premium
export function activatePremium(code: string): boolean {
  // For now, accept any code since premium is free
  // In the future, this would validate against a server or Gumroad API
  
  // Set premium status for 365 days (or forever during free period)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 365);
  
  localStorage.setItem('breathBetterPremiumCode', code);
  localStorage.setItem('breathBetterPremiumExpiry', expiryDate.toISOString());
  
  return true;
}

// Deactivate premium
export function deactivatePremium(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('breathBetterPremiumCode');
  localStorage.removeItem('breathBetterPremiumExpiry');
}

// Get premium expiry date
export function getPremiumExpiryDate(): Date | null {
  if (typeof window === 'undefined') return null;
  
  const premiumExpiry = localStorage.getItem('breathBetterPremiumExpiry');
  if (!premiumExpiry) return null;
  
  return new Date(premiumExpiry);
}

export function setPremiumActive(active: boolean): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('breathBetterPremium', active ? 'active' : 'inactive');
} 