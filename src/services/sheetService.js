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

  getAllItems: async (type = 'SUPPLIES', forceFresh = false) => {
    try {
      const url = `${getAuthenticatedUrl(type)}?_t=${Date.now()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Map the data based on type
      const processedData = data.map((item, index) => {
        if (type === 'SUPPLIES') {
          return {
            itemSpecifications: item['Item & Specifications'] || '',
            unitOfMeasure: item['Unit of Measure'] || '',
            beginningBalance: parseFloat(item['Beginning Balance as of 02/01/2025']) || 0,
            purchasesForMonth: parseFloat(item['Purchases for the Month']) || 0,
            totalBalance: parseFloat(item['Total Balance']) || 0,
            adjustment: parseFloat(item['ADJUSTMENT']) || 0,
            examination: parseFloat(item['EXAMINATION']) || 0,
            lrd: parseFloat(item['LRD']) || 0,
            application: parseFloat(item['APPLICATION']) || 0,
            regulation: parseFloat(item['REGULATION']) || 0,
            registration: parseFloat(item['REGISTRATION']) || 0,
            admin: parseFloat(item['ADMIN']) || 0,
            ord: parseFloat(item['ORD']) || 0,
            valencia: parseFloat(item['VALENCIA']) || 0,
            iligan: parseFloat(item['ILIGAN']) || 0,
            totalReleases: parseFloat(item['Total Releases']) || 0,
            endingBalance: parseFloat(item['Ending Balance as of 02/28/2025']) || 0,
            unitCost: parseFloat(item['UNIT COST']) || 0,
            totalAmount: parseFloat(item['TOTAL AMOUNT']) || 0,
            psPriceDBM: parseFloat(item['PS/DBM PRICE']) || 0,
            outsidePSPrice: parseFloat(item['OUTSIDE PS PRICE']) || 0,
            _rowIndex: index + 0
          };
        } else {
          // Keep existing mapping for computers, laptops, and printers
          return {
            serialNo: item['Serial No.'],
            propertyNo: item['Property No.'],
            brandModel: item['Brand/Model'],
            monitorSerialNo: item['Monitor Serial No.'],
            monitorPropertyNo: item['Monitor Property No.'],
            monitorBrandModel: item['Monitor Brand/Model'],
            unitCost: item['UNIT COST'],
            date: item['DATE'],
            accountablePerson: item['ACCT. PERSON'],
            status: item['STATUS  (SERVICEABLE/ UNSERVICEABLE)'],
            location: item['LOCATION'],
            user: item['USER'],
            pcName: item['PCNAME'],
            remarks: item['REMARKS'],
            _rowIndex: index + 0
          };
        }
      });

      return processedData;
    } catch (error) {
      console.error('Error in getAllItems:', error);
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
      const url = getAuthenticatedUrl(type);
      let formattedItem;
      
      // Normalize type to uppercase for consistent comparison
      const normalizedType = type.toUpperCase();

      switch (normalizedType) {
        case 'SUPPLIES':
          formattedItem = {
            'Item & Specifications': item.itemSpecifications,
            'Unit of Measure': item.unitOfMeasure,
            'Beginning Balance as of 02/01/2025': item.beginningBalance,
            'Purchases for the Month': item.purchasesForMonth,
            'Total Balance': item.totalBalance,
            'Adjustment': item.adjustment,
            'Examination': item.examination,
            'LRD': item.lrd,
            'Application': item.application,
            'Regulation': item.regulation,
            'Registration': item.registration,
            'Admin': item.admin,
            'ORD': item.ord,
            'Valencia': item.valencia,
            'Iligan': item.iligan,
            'Total Releases': item.totalReleases,
            'Ending Balance as of 02/28/2025': item.endingBalance,
            'Unit Cost': item.unitCost,
            'Total Amount': item.totalAmount,
            'PS/DBM Price': item.psPriceDBM,
            'Outside PS Price': item.outsidePSPrice
          };
          break;

        case 'PRINTERS':
          formattedItem = {
            'Type': item.type,
            'Serial No.': item.serialNo,
            'Property No.': item.propertyNo,
            'Brand/Model': item.brandModel,
            'UNIT COST': item.unitCost,
            'DATE': item.date,
            'ACCT. PERSON': item.accountablePerson,
            'STATUS  (SERVICEABLE/ UNSERVICEABLE)': item.status,
            'LOCATION': item.location,
            'USER': item.user
          };
          break;

        case 'COMPUTERS':
        case 'LAPTOPS':
          formattedItem = {
            'Serial No.': item.serialNo || item.systemUnit?.serialNo,
            'Property No.': item.propertyNo || item.systemUnit?.propertyNo,
            'Brand/Model': item.brandModel || item.systemUnit?.brandModel,
            'Monitor Serial No.': item.monitorSerialNo || item.monitor?.serialNo,
            'Monitor Property No.': item.monitorPropertyNo || item.monitor?.propertyNo,
            'Monitor Brand/Model': item.monitorBrandModel || item.monitor?.brandModel,
            'UNIT COST': item.unitCost,
            'DATE': item.date,
            'ACCT. PERSON': item.accountablePerson,
            'STATUS  (SERVICEABLE/ UNSERVICEABLE)': item.status,
            'LOCATION': item.location,
            'USER': item.user,
            'PCNAME': item.pcName,
            'REMARKS': item.remarks
          };
          break;

        default:
          throw new Error(`Unknown type: ${type}. Expected COMPUTERS, LAPTOPS, PRINTERS, or SUPPLIES`);
      }

      console.log('Sending formatted item:', formattedItem);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedItem)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return true;
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

  updateItem: async (itemId, updatedData) => {
    try {
      const url = getAuthenticatedUrl(`/${itemId}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  deleteItem: async (rowId) => {
    try {
      const response = await fetch(getAuthenticatedUrl(`/${rowId}`), {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
  }
};
// Export the valid status values for use in components
export const STATUS_OPTIONS = VALID_STATUS; 
