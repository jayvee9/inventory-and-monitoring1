import { supabase } from '../config/supabaseClient';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://api.sheetbest.com/sheets/0193b11b-d499-4c08-a3a2-d562a388086c',
  TABS: {
    COMPUTERS: '',  // Default tab
    LAPTOPS: '/tabs/Laptops',
    PRINTERS: '/tabs/PrintersPeripherals',  // Updated path
    SUPPLIES: '/tabs/OfficeSupplies',
  },
  API_KEY: 'rqjwWhDOI7XREbycmd8I3Y6meS4vPZoC3yzKJoFVL%yy3I8_j7Co5#el21_t3e5A'
};

// Define valid status values
const VALID_STATUS = {
  SERVICEABLE: 'SERVICEABLE',
  UNSERVICEABLE: 'UNSERVICEABLE'
};

// Updated headers to exactly match Google Sheet column names
export const HEADERS = {
  SYSTEM_UNIT: {
    SERIAL_NO: 'Serial No.',
    PROPERTY_NO: 'Property No.',
    BRAND_MODEL: 'Brand/Model'
  },
  MONITOR: {
    SERIAL_NO: 'Monitor Serial No.',
    PROPERTY_NO: 'Monitor Property No.',
    BRAND_MODEL: 'Monitor Brand/Model'
  },
  COMMON: {
    UNIT_COST: 'UNIT COST',
    DATE: 'DATE',
    ACCT_PERSON: 'ACCT. PERSON',
    STATUS: 'STATUS  (SERVICEABLE/ UNSERVICEABLE)',
    LOCATION: 'LOCATION',
    USER: 'USER',
    REMARKS: 'REMARKS'
  },
  DEVICE: {
    TYPE: 'Type',
    SERIAL_NO: 'Serial No.',
    PROPERTY_NO: 'Property No.',
    BRAND_MODEL: 'Brand/Model'
  },
  SUPPLIES: {
    ITEM: 'Item',
    MIN_INVENTORY: 'Inventory Minimum',
    QUANTITY: 'Quantity',
    UNITS: 'Units',
    PURPOSE: 'Purpose',
    REQUESTER: 'Requester'
  }
};

const VERIFICATION_DELAY = 3000; // Initial delay
const MAX_RETRIES = 5; // Reduced from 10
const RETRY_DELAY = 2000;
const MAX_FETCH_RETRIES = 3;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
};

// Helper function to construct authenticated URLs
const getAuthenticatedUrl = (type = 'COMPUTERS') => {
  const tabPath = API_CONFIG.TABS[type.toUpperCase()] || '';
  const url = new URL(API_CONFIG.BASE_URL + tabPath);
  url.searchParams.append('key', API_CONFIG.API_KEY);
  return url.toString();
};

export const sheetService = {
  // Simplified fetch with minimal headers
  fetchWithRetries: async (url, retryCount = 0) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: Expected array');
      }

      return data;
    } catch (error) {
      if (retryCount < MAX_FETCH_RETRIES) {
        console.log(`Fetch attempt ${retryCount + 1} failed, retrying...`);
        await wait(1000);
        return sheetService.fetchWithRetries(url, retryCount + 1);
      }
      throw error;
    }
  },

  getAllItems: async (type = 'COMPUTERS') => {
    try {
      const tableName = type === 'PRINTERS' ? 'printers_peripherals' : type.toLowerCase();
      
      let { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((item) => ({
        serialNo: item.serial_no,
        propertyNo: item.property_no,
        brandModel: item.brand_model,
        unitCost: item.unit_cost,
        date: item.date,
        accountablePerson: item.accountable_person,
        status: item.status || 'SERVICEABLE',
        location: item.location,
        id: item.id
      }));
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  findItemInDataset: async (newItem, retryCount = 0) => {
    try {
      console.log(`\nSearching for item (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      console.log('Searching for:', newItem);

      const items = await sheetService.getAllItems(true);
      
      // Search through all items, not just the last 5
      const matches = items.filter(item => {
        const serialNoMatch = normalizeValue(item[HEADERS.SYSTEM_UNIT.SERIAL_NO]) === 
                            normalizeValue(newItem[HEADERS.SYSTEM_UNIT.SERIAL_NO]);
        const propertyNoMatch = normalizeValue(item[HEADERS.SYSTEM_UNIT.PROPERTY_NO]) === 
                               normalizeValue(newItem[HEADERS.SYSTEM_UNIT.PROPERTY_NO]);
        
        if (serialNoMatch && propertyNoMatch) {
          console.log('Found matching item at row:', item._rowIndex);
          console.log('Matched item:', item);
        }
        
        return serialNoMatch && propertyNoMatch;
      });

      console.log(`Found ${matches.length} matching items`);
      return matches.length > 0;
    } catch (error) {
      console.error('Error searching for item:', error);
      return false;
    }
  },

  verifyItemAdded: async (newItem, retryCount = 0) => {
    try {
      console.log(`Verification attempt ${retryCount + 1}/${MAX_RETRIES}`);
      console.log('Looking for item with status:', newItem[HEADERS.COMMON.STATUS]);

      await wait(VERIFICATION_DELAY + (retryCount * RETRY_DELAY));

      const items = await sheetService.getAllItems(true);
      console.log(`Fetched ${items.length} items for verification`);
      
      // Check recent items (last 5)
      const recentItems = items.slice(-5);
      
      const found = recentItems.some(item => {
        // Define all match conditions
        const matches = {
          status: item[HEADERS.COMMON.STATUS] === newItem[HEADERS.COMMON.STATUS],
          serialNo: item[HEADERS.SYSTEM_UNIT.SERIAL_NO] === newItem[HEADERS.SYSTEM_UNIT.SERIAL_NO],
          propertyNo: item[HEADERS.SYSTEM_UNIT.PROPERTY_NO] === newItem[HEADERS.SYSTEM_UNIT.PROPERTY_NO]
        };
        
        // Log comparison for debugging
        console.log('Comparing item:', {
          expected: {
            status: newItem[HEADERS.COMMON.STATUS],
            serialNo: newItem[HEADERS.SYSTEM_UNIT.SERIAL_NO],
            propertyNo: newItem[HEADERS.SYSTEM_UNIT.PROPERTY_NO]
          },
          actual: {
            status: item[HEADERS.COMMON.STATUS],
            serialNo: item[HEADERS.SYSTEM_UNIT.SERIAL_NO],
            propertyNo: item[HEADERS.SYSTEM_UNIT.PROPERTY_NO]
          },
          matches
        });

        // Return true only if all conditions match
        return matches.status && matches.serialNo && matches.propertyNo;
      });

      if (found) {
        console.log('Item verified with correct status!');
        return true;
      }

      if (retryCount < MAX_RETRIES) {
        console.log('Item not found, retrying verification...');
        return sheetService.verifyItemAdded(newItem, retryCount + 1);
      }

      console.log('Verification failed after all retries');
      return false;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  },

  validateItem: (item) => {
    const requiredFields = [
      'type',
      'serialNo',
      'propertyNo',
      'brandModel',
      'unitCost',
      'date',
      'accountablePerson',
      'status',
      'location',
      'user'
    ];

    const errors = [];
    
    requiredFields.forEach(field => {
      const value = field.includes('.') 
        ? item[field.split('.')[0]][field.split('.')[1]]
        : item[field];
        
      if (!value || value.trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    if (item.unitCost && isNaN(parseFloat(item.unitCost))) {
      errors.push('Unit cost must be a valid number');
    }

    return errors;
  },

  validateStatus: (status) => {
    if (!status) {
      throw new Error('Status is required');
    }
    
    const normalizedStatus = status.trim().toUpperCase();
    console.log('Validating status:', normalizedStatus);
    
    if (!Object.values(VALID_STATUS).includes(normalizedStatus)) {
      throw new Error(`Invalid status. Must be either ${VALID_STATUS.SERVICEABLE} or ${VALID_STATUS.UNSERVICEABLE}`);
    }
    
    return normalizedStatus;
  },

  addItem: async (item, type) => {
    try {
      const tableName = type === 'PRINTERS' ? 'printers_peripherals' : type.toLowerCase();
      
      const formattedItem = {
        serial_no: item.serialNo,
        property_no: item.propertyNo,
        brand_model: item.brandModel,
        unit_cost: item.unitCost,
        date: item.date,
        accountable_person: item.accountablePerson,
        status: 'SERVICEABLE',
        location: item.location
      };

      const { data, error } = await supabase
        .from(tableName)
        .insert([formattedItem])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  searchItems: async (searchTerm, filters = {}) => {
    try {
      const items = await sheetService.getAllItems();
      
      if (!items.length) {
        return [];
      }

      return items.filter(item => {
        // First handle the search term
        if (searchTerm) {
          const searchString = searchTerm.toLowerCase();
          const searchableFields = [
            item[HEADERS.SYSTEM_UNIT.SERIAL_NO],
            item[HEADERS.SYSTEM_UNIT.PROPERTY_NO],
            item[HEADERS.SYSTEM_UNIT.BRAND_MODEL],
            item[HEADERS.MONITOR.SERIAL_NO],
            item[HEADERS.MONITOR.PROPERTY_NO],
            item[HEADERS.MONITOR.BRAND_MODEL],
            item[HEADERS.COMMON.LOCATION],
            item[HEADERS.COMMON.USER]
          ];
          
          const matchesSearch = searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(searchString)
          );
          
          if (!matchesSearch) return false;
        }
        
        // Handle status filter specifically
        if (filters.STATUS) {
          const itemStatus = item[HEADERS.COMMON.STATUS];
          // Add logging to debug the status comparison
          console.log('Item Status:', itemStatus, 'Filter Status:', filters.STATUS);
          // Compare status after trimming and converting to uppercase
          return itemStatus && itemStatus.trim().toUpperCase() === filters.STATUS.trim().toUpperCase();
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
    }
  },

  updateItem: async (item, type) => {
    try {
      const { data, error } = await supabase
        .from(type.toLowerCase())
        .update(item)
        .eq('id', item.id)
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  deleteItem: async (id, type) => {
    try {
      const { error } = await supabase
        .from(type.toLowerCase())
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  checkApiConnection: async () => {
    try {
      const url = getAuthenticatedUrl();
      const response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });
      
      if (!response.ok) {
        console.error('API connection check failed:', {
          status: response.status,
          statusText: response.statusText
        });
      }
      
      return response.ok;
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  },

  sortItems: (items, field, direction = 'asc') => {
    if (!Array.isArray(items) || !field) return items;

    return [...items].sort((a, b) => {
      let valueA = a[field] || '';
      let valueB = b[field] || '';

      // Handle numeric values (like unitCost)
      if (field === 'unitCost') {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      } else {
        // Convert to strings for string comparison
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  },

  updateItemStatus: async (item, type) => {
    try {
      const { data, error } = await supabase
        .from(type.toLowerCase())
        .update({
          maintenance_date: item.maintenanceDate,
          disposal_date: item.disposalDate,
          disposal_location: item.disposalLocation
        })
        .eq('id', item.id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
};
// Export the valid status values for use in components
export const STATUS_OPTIONS = VALID_STATUS; 
