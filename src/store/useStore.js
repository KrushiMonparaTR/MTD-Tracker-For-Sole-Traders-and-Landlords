import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc 
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { APP_ID, DEMO_MODE } from '../config/firebase';
import { DEMO_TRANSACTIONS, DEMO_LANDLORD_TRANSACTIONS } from '../data/demoData';

// Demo mode helpers
const DEMO_USER_KEY = 'mtd-demo-user';
const DEMO_PROFILE_KEY = 'mtd-demo-profile';
const DEMO_TRANSACTIONS_KEY = 'mtd-demo-transactions';

const getDemoUser = () => {
  const stored = localStorage.getItem(DEMO_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

const setDemoUser = (user) => {
  if (user) {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(DEMO_USER_KEY);
  }
};

const getDemoProfile = (businessType = null) => {
  const key = businessType ? `${DEMO_PROFILE_KEY}-${businessType}` : DEMO_PROFILE_KEY;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

const setDemoProfile = (profile, businessType = null) => {
  const key = businessType ? `${DEMO_PROFILE_KEY}-${businessType}` : DEMO_PROFILE_KEY;
  if (profile) {
    localStorage.setItem(key, JSON.stringify(profile));
  } else {
    localStorage.removeItem(key);
  }
};

const getDemoTransactions = (businessType = null) => {
  const key = businessType ? `${DEMO_TRANSACTIONS_KEY}-${businessType}` : DEMO_TRANSACTIONS_KEY;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const setDemoTransactions = (transactions, businessType = null) => {
  const key = businessType ? `${DEMO_TRANSACTIONS_KEY}-${businessType}` : DEMO_TRANSACTIONS_KEY;
  localStorage.setItem(key, JSON.stringify(transactions));
};

const useStore = create((set, get) => ({
  // Authentication state
  user: null,
  loading: true,
  error: null,

  // User profile state
  userProfile: null,
  userType: null, // 'sole_trader' or 'landlord'

  // Business management state
  businessTypes: [], // Array of business types (sole_trader, landlord)
  businesses: [], // Array of individual businesses within types
  currentBusinessId: null, // Currently selected individual business
  
  // Transactions state
  transactions: [],
  transactionsLoading: false,

  // UI state
  showTransactionForm: false,
  editingTransaction: null,

  // Actions
  setUser: (user) => set({ user, loading: false }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  // Authentication actions
  signIn: async (email, password, businessType = null) => {
    try {
      set({ loading: true, error: null });
      
      if (DEMO_MODE) {
        // Demo mode authentication
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        const demoUser = {
          uid: 'demo-user-123',
          email: email,
          displayName: email.split('@')[0]
        };
        
        setDemoUser(demoUser);
        set({ user: demoUser, userProfile: null, userType: null, transactions: [], loading: false });
        
        // Only load profile if business type is specified (for switching)
        if (businessType) {
          // Load demo profile - prioritize the selected business type
          let profile = getDemoProfile(businessType);
          
          if (profile) {
            set({ userProfile: profile, userType: profile.userType });
            
            // Load transactions based on user's business type
            const storedTransactions = getDemoTransactions(profile.userType);
            if (storedTransactions.length === 0) {
              // If no stored transactions, load default demo data for this business type
              const defaultTransactions = profile.userType === 'sole_trader' ? DEMO_TRANSACTIONS : DEMO_LANDLORD_TRANSACTIONS;
              setDemoTransactions(defaultTransactions, profile.userType);
              set({ transactions: defaultTransactions });
            } else {
              set({ transactions: storedTransactions });
            }
          } else if (businessType) {
            // If no profile exists for this business type, create a new one
            const profileData = {
              email,
              userType: businessType,
              calendarElection: false,
              createdAt: new Date().toISOString()
            };
            
            const demoTransactions = businessType === 'sole_trader' ? DEMO_TRANSACTIONS : DEMO_LANDLORD_TRANSACTIONS;
            
            setDemoProfile(profileData, businessType);
            setDemoTransactions(demoTransactions, businessType);
            
            set({ 
              userProfile: profileData, 
              userType: businessType,
              transactions: demoTransactions
            });
          }
        }
        // If no businessType provided, just authenticate and let user select business type
        
        return demoUser;
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (email, password, userType = null) => {
    try {
      set({ loading: true, error: null });
      
      if (DEMO_MODE) {
        // Demo mode registration
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        const demoUser = {
          uid: 'demo-user-123',
          email: email,
          displayName: email.split('@')[0]
        };
        
        setDemoUser(demoUser);
        
        if (userType) {
          // Only create profile if userType is provided
          const profileData = {
            email,
            userType,
            calendarElection: false, // Default to standard UK tax year
            createdAt: new Date().toISOString()
          };
          
          // Initialize with demo data
          const demoTransactions = userType === 'sole_trader' ? DEMO_TRANSACTIONS : DEMO_LANDLORD_TRANSACTIONS;
          
          setDemoProfile(profileData, userType);
          setDemoTransactions(demoTransactions, userType);
          
          set({ 
            user: demoUser, 
            userProfile: profileData, 
            userType: userType,
            transactions: demoTransactions,
            loading: false 
          });
        } else {
          // No business type provided - user will select later
          set({ 
            user: demoUser, 
            userProfile: null, 
            userType: null,
            transactions: [],
            businesses: [],
            currentBusinessId: null,
            loading: false 
          });
        }
        
        return demoUser;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        if (userType) {
          // Create user profile only if userType is provided
          await get().createUserProfile(userCredential.user.uid, {
            email,
            userType,
            calendarElection: false, // Default to standard UK tax year
            createdAt: new Date().toISOString()
          });
        }
        
        return userCredential.user;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      if (DEMO_MODE) {
        setDemoUser(null);
        // Clear both business type profiles
        setDemoProfile(null, 'sole_trader');
        setDemoProfile(null, 'landlord');
        setDemoProfile(null); // Clear general profile too
        setDemoTransactions([], 'sole_trader');
        setDemoTransactions([], 'landlord');
        setDemoTransactions([]); // Clear general transactions too
        set({ user: null, userProfile: null, userType: null, transactions: [] });
      } else {
        await signOut(auth);
        set({ user: null, userProfile: null, userType: null, transactions: [] });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // User profile actions
  createUserProfile: async (userId, profileData) => {
    try {
      const profileRef = doc(db, `artifacts/${APP_ID}/users/${userId}/profile`, 'data');
      await setDoc(profileRef, profileData);
      set({ userProfile: profileData, userType: profileData.userType });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateUserProfile: async (updates) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      if (DEMO_MODE) {
        const currentProfile = get().userProfile;
        const updatedProfile = { ...currentProfile, ...updates };
        setDemoProfile(updatedProfile, currentProfile.userType);
        
        set({ 
          userProfile: updatedProfile,
          userType: updates.userType || currentProfile.userType
        });
      } else {
        const profileRef = doc(db, `artifacts/${APP_ID}/users/${user.uid}/profile`, 'data');
        await updateDoc(profileRef, updates);
        
        const currentProfile = get().userProfile;
        set({ 
          userProfile: { ...currentProfile, ...updates },
          userType: updates.userType || currentProfile.userType
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Switch business type and load corresponding data
  switchBusinessType: async (newBusinessType) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      if (DEMO_MODE) {
        // Get or create profile for the new business type
        let profile = getDemoProfile(newBusinessType);
        
        if (!profile) {
          // Create new profile for this business type
          profile = {
            email: user.email,
            userType: newBusinessType,
            calendarElection: false,
            createdAt: new Date().toISOString()
          };
          setDemoProfile(profile, newBusinessType);
        }
        
        // Load transactions for this business type
        let transactions = getDemoTransactions(newBusinessType);
        if (transactions.length === 0) {
          // Load default demo data for this business type
          const defaultTransactions = newBusinessType === 'sole_trader' ? DEMO_TRANSACTIONS : DEMO_LANDLORD_TRANSACTIONS;
          setDemoTransactions(defaultTransactions, newBusinessType);
          transactions = defaultTransactions;
        }
        
        // Update state
        set({ 
          userProfile: profile, 
          userType: newBusinessType,
          transactions: transactions
        });
      } else {
        // Handle Firebase mode business type switching
        // This would involve loading/creating profiles for different business types
        // For now, we'll update the current profile
        await get().updateUserProfile({ userType: newBusinessType });
        await get().loadTransactions(user.uid);
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  loadUserProfile: async (userId) => {
    try {
      const profileRef = doc(db, `artifacts/${APP_ID}/users/${userId}/profile`, 'data');
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        set({ userProfile: profileData, userType: profileData.userType });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Transaction actions
  addTransaction: async (transactionData) => {
    try {
      const { user, currentBusinessId } = get();
      if (!user) throw new Error('No user logged in');
      if (!currentBusinessId) throw new Error('No business selected');

      if (DEMO_MODE) {
        const businessTransactions = JSON.parse(localStorage.getItem(`mtd-transactions-${currentBusinessId}`) || '[]');
        const newTransaction = {
          id: 'demo-' + Date.now(),
          businessId: currentBusinessId,
          ...transactionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const updatedTransactions = [newTransaction, ...businessTransactions];
        localStorage.setItem(`mtd-transactions-${currentBusinessId}`, JSON.stringify(updatedTransactions));
        set({ transactions: updatedTransactions });
        
        return newTransaction.id;
      } else {
        const transactionsRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/businesses/${currentBusinessId}/transactions`);
        const docRef = await addDoc(transactionsRef, {
          ...transactionData,
          businessId: currentBusinessId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return docRef.id;
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTransaction: async (transactionId, updates) => {
    try {
      const { user, currentBusinessId } = get();
      if (!user) throw new Error('No user logged in');
      if (!currentBusinessId) throw new Error('No business selected');

      if (DEMO_MODE) {
        const businessTransactions = JSON.parse(localStorage.getItem(`mtd-transactions-${currentBusinessId}`) || '[]');
        const updatedTransactions = businessTransactions.map(t => 
          t.id === transactionId 
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        );
        
        localStorage.setItem(`mtd-transactions-${currentBusinessId}`, JSON.stringify(updatedTransactions));
        set({ transactions: updatedTransactions });
      } else {
        const transactionRef = doc(db, `artifacts/${APP_ID}/users/${user.uid}/businesses/${currentBusinessId}/transactions`, transactionId);
        await updateDoc(transactionRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteTransaction: async (transactionId) => {
    try {
      const { user, currentBusinessId } = get();
      if (!user) throw new Error('No user logged in');
      if (!currentBusinessId) throw new Error('No business selected');

      if (DEMO_MODE) {
        const businessTransactions = JSON.parse(localStorage.getItem(`mtd-transactions-${currentBusinessId}`) || '[]');
        const updatedTransactions = businessTransactions.filter(t => t.id !== transactionId);
        
        localStorage.setItem(`mtd-transactions-${currentBusinessId}`, JSON.stringify(updatedTransactions));
        set({ transactions: updatedTransactions });
      } else {
        const transactionRef = doc(db, `artifacts/${APP_ID}/users/${user.uid}/businesses/${currentBusinessId}/transactions`, transactionId);
        await deleteDoc(transactionRef);
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  subscribeToTransactions: (userId) => {
    const transactionsRef = collection(db, `artifacts/${APP_ID}/users/${userId}/transactions`);
    const q = query(transactionsRef, orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ transactions, transactionsLoading: false });
    }, (error) => {
      set({ error: error.message, transactionsLoading: false });
    });
  },

  // UI actions
  setShowTransactionForm: (show) => set({ showTransactionForm: show }),
  setEditingTransaction: (transaction) => set({ editingTransaction: transaction }),

  // Business management actions
  // Create or get business type
  createBusinessType: (businessType) => {
    const { businessTypes } = get();
    
    // Check if business type already exists
    const existingType = businessTypes.find(bt => bt.type === businessType);
    if (existingType) {
      return existingType;
    }
    
    const newBusinessType = {
      id: `type-${businessType}-${Date.now()}`,
      type: businessType,
      name: businessType === 'sole_trader' ? 'Sole Trader Businesses' : 'Property Businesses',
      calendarElection: false,
      createdAt: new Date().toISOString(),
      businesses: []
    };
    
    const updatedBusinessTypes = [...businessTypes, newBusinessType];
    set({ businessTypes: updatedBusinessTypes });
    
    // Save to localStorage in demo mode
    if (DEMO_MODE) {
      localStorage.setItem('mtd-business-types', JSON.stringify(updatedBusinessTypes));
    }
    
    return newBusinessType;
  },

  // Add individual business within a business type
  addBusiness: (businessData) => {
    const { businessTypes, businesses } = get();
    
    // Ensure business type exists
    let businessType = businessTypes.find(bt => bt.type === businessData.type);
    if (!businessType) {
      businessType = get().createBusinessType(businessData.type);
    }
    
    const newBusiness = {
      id: `business-${Date.now()}`,
      ...businessData,
      businessTypeId: businessType.id,
      createdAt: new Date().toISOString()
    };
    
    const updatedBusinesses = [...businesses, newBusiness];
    set({ businesses: updatedBusinesses });
    
    // Save to localStorage in demo mode
    if (DEMO_MODE) {
      localStorage.setItem('mtd-businesses', JSON.stringify(updatedBusinesses));
    }
    
    return newBusiness;
  },

  updateBusiness: (businessId, updates) => {
    const { businesses } = get();
    
    const updatedBusinesses = businesses.map(business =>
      business.id === businessId ? { ...business, ...updates, updatedAt: new Date().toISOString() } : business
    );
    set({ businesses: updatedBusinesses });
    
    // Save to localStorage in demo mode
    if (DEMO_MODE) {
      localStorage.setItem('mtd-businesses', JSON.stringify(updatedBusinesses));
    }
  },

  deleteBusiness: (businessId) => {
    const { businesses, currentBusinessId } = get();
    const updatedBusinesses = businesses.filter(business => business.id !== businessId);
    set({ 
      businesses: updatedBusinesses,
      currentBusinessId: currentBusinessId === businessId ? (updatedBusinesses[0]?.id || null) : currentBusinessId
    });
    
    // Save to localStorage in demo mode
    if (DEMO_MODE) {
      localStorage.setItem('mtd-businesses', JSON.stringify(updatedBusinesses));
      // Also clean up business-specific transaction data
      localStorage.removeItem(`mtd-transactions-${businessId}`);
    }
  },

  // Get businesses by type
  getBusinessesByType: (businessType) => {
    const { businesses } = get();
    return businesses.filter(b => b.type === businessType);
  },

  // Get current business
  getCurrentBusiness: () => {
    const { businesses, currentBusinessId } = get();
    return businesses.find(b => b.id === currentBusinessId) || null;
  },

  deleteBusiness: (businessId) => {
    const { businesses, currentBusinessId } = get();
    const updatedBusinesses = businesses.filter(business => business.id !== businessId);
    set({ 
      businesses: updatedBusinesses,
      currentBusinessId: currentBusinessId === businessId ? (updatedBusinesses[0]?.id || null) : currentBusinessId
    });
    
    // Save to localStorage in demo mode
    if (DEMO_MODE) {
      localStorage.setItem('mtd-businesses', JSON.stringify(updatedBusinesses));
      // Also clean up business-specific transaction data
      localStorage.removeItem(`mtd-transactions-${businessId}`);
    }
  },

  selectBusiness: (businessId) => {
    const { businesses } = get();
    const selectedBusiness = businesses.find(b => b.id === businessId);
    if (selectedBusiness) {
      set({ currentBusinessId: businessId, userType: selectedBusiness.type });
      
      // Load transactions for this business
      if (DEMO_MODE) {
        const businessTransactions = localStorage.getItem(`mtd-transactions-${businessId}`);
        if (businessTransactions) {
          set({ transactions: JSON.parse(businessTransactions) });
        } else {
          // Load default demo data based on business type
          const defaultTransactions = selectedBusiness.type === 'sole_trader' ? DEMO_TRANSACTIONS : DEMO_LANDLORD_TRANSACTIONS;
          set({ transactions: defaultTransactions });
          localStorage.setItem(`mtd-transactions-${businessId}`, JSON.stringify(defaultTransactions));
        }
      }
    }
  },

  // Get businesses by type
  getBusinessesByType: (businessType) => {
    const { businesses } = get();
    return businesses.filter(b => b.type === businessType);
  },

  // Get current business
  getCurrentBusiness: () => {
    const { businesses, currentBusinessId } = get();
    return businesses.find(b => b.id === currentBusinessId) || null;
  },

  // Debug function to clear all localStorage data
  clearAllDemoData: () => {
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem(DEMO_PROFILE_KEY);
    localStorage.removeItem(DEMO_TRANSACTIONS_KEY);
    localStorage.removeItem('mtd-businesses');
    localStorage.removeItem('mtd-business-types');
    localStorage.removeItem(`${DEMO_PROFILE_KEY}-sole_trader`);
    localStorage.removeItem(`${DEMO_PROFILE_KEY}-landlord`);
    localStorage.removeItem(`${DEMO_TRANSACTIONS_KEY}-sole_trader`);
    localStorage.removeItem(`${DEMO_TRANSACTIONS_KEY}-landlord`);
    set({ 
      user: null, 
      userProfile: null, 
      userType: null, 
      businesses: [],
      businessTypes: [],
      currentBusinessId: null,
      transactions: [], 
      loading: false 
    });
  },

  // Initialize auth listener
  initializeAuth: () => {
    console.log('initializeAuth called, DEMO_MODE:', DEMO_MODE);
    
    if (DEMO_MODE) {
      // Demo mode initialization
      const demoUser = getDemoUser();
      console.log('Demo user from localStorage:', demoUser);
      
      if (demoUser) {
        // Load businesses and business types from localStorage
        const savedBusinesses = localStorage.getItem('mtd-businesses');
        const savedBusinessTypes = localStorage.getItem('mtd-business-types');
        
        let businesses = [];
        let businessTypes = [];
        
        if (savedBusinesses) {
          businesses = JSON.parse(savedBusinesses);
        }
        
        if (savedBusinessTypes) {
          businessTypes = JSON.parse(savedBusinessTypes);
        }
        
        // Don't create default businesses - let user choose
        
        const currentBusinessId = businesses[0]?.id || null;
        const currentBusiness = businesses[0] || null;
        
        if (currentBusiness) {
          // Load transactions for the current business
          const businessTransactions = localStorage.getItem(`mtd-transactions-${currentBusinessId}`);
          let transactions = [];
          
          if (businessTransactions) {
            transactions = JSON.parse(businessTransactions);
          } else {
            // Load default demo data based on business type
            transactions = currentBusiness.type === 'sole_trader' ? DEMO_TRANSACTIONS : DEMO_LANDLORD_TRANSACTIONS;
            localStorage.setItem(`mtd-transactions-${currentBusinessId}`, JSON.stringify(transactions));
          }
          
          set({ 
            user: demoUser, 
            businesses,
            businessTypes,
            currentBusinessId,
            userType: currentBusiness.type,
            transactions,
            loading: false 
          });
        } else {
          // No businesses yet - user will create one
          set({ 
            user: demoUser, 
            businesses: [], 
            businessTypes,
            currentBusinessId: null,
            userType: null,
            transactions: [],
            loading: false 
          });
        }
      } else {
        console.log('No demo user found, setting loading false');
        set({ loading: false });
      }
      
      // Return a no-op function for demo mode
      return () => {};
    } else {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          set({ user, loading: false });
          await get().loadUserProfile(user.uid);
          get().subscribeToTransactions(user.uid);
        } else {
          set({ user: null, userProfile: null, userType: null, transactions: [], loading: false });
        }
      });
    }
  }
}));

export default useStore;
