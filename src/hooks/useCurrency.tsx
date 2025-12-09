import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface CurrencySettings {
  defaultCurrency: 'RWF' | 'USD';
  showBothCurrencies: boolean;
  exchangeRate: number;
}

interface CurrencyContextType {
  settings: CurrencySettings;
  updateSettings: (settings: CurrencySettings) => void;
  formatAmount: (amount: number, originalCurrency?: 'RWF' | 'USD') => string;
  formatAmountWithBoth: (amount: number, originalCurrency?: 'RWF' | 'USD') => { primary: string; secondary?: string };
  convertToDefault: (amount: number, originalCurrency: 'RWF' | 'USD') => number;
}

const defaultSettings: CurrencySettings = {
  defaultCurrency: 'RWF',
  showBothCurrencies: true,
  exchangeRate: 1300,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CurrencySettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem('mushya_currency_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  // Listen for storage changes from settings page
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('mushya_currency_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes (for same-tab updates)
    const interval = setInterval(() => {
      const stored = localStorage.getItem('mushya_currency_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (JSON.stringify(parsed) !== JSON.stringify(settings)) {
          setSettings(parsed);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [settings]);

  const updateSettings = (newSettings: CurrencySettings) => {
    setSettings(newSettings);
    localStorage.setItem('mushya_currency_settings', JSON.stringify(newSettings));
  };

  const convertToDefault = (amount: number, originalCurrency: 'RWF' | 'USD'): number => {
    if (originalCurrency === settings.defaultCurrency) {
      return amount;
    }
    if (settings.defaultCurrency === 'RWF') {
      // Convert USD to RWF
      return amount * settings.exchangeRate;
    } else {
      // Convert RWF to USD
      return amount / settings.exchangeRate;
    }
  };

  const formatAmount = (amount: number, originalCurrency: 'RWF' | 'USD' = 'USD'): string => {
    const convertedAmount = convertToDefault(amount, originalCurrency);
    
    if (settings.defaultCurrency === 'RWF') {
      return `RWF ${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      return `$${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatAmountWithBoth = (amount: number, originalCurrency: 'RWF' | 'USD' = 'USD'): { primary: string; secondary?: string } => {
    const convertedAmount = convertToDefault(amount, originalCurrency);
    
    let primary: string;
    let secondary: string | undefined;

    if (settings.defaultCurrency === 'RWF') {
      primary = `RWF ${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      if (settings.showBothCurrencies) {
        const usdAmount = convertedAmount / settings.exchangeRate;
        secondary = `≈ $${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    } else {
      primary = `$${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (settings.showBothCurrencies) {
        const rwfAmount = convertedAmount * settings.exchangeRate;
        secondary = `≈ RWF ${rwfAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      }
    }

    return { primary, secondary };
  };

  return (
    <CurrencyContext.Provider value={{
      settings,
      updateSettings,
      formatAmount,
      formatAmountWithBoth,
      convertToDefault,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
