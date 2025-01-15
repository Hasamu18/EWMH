const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';
 
export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  }  ,
  ewmh: {
    background: '#3F72AF',    
    background2: '#DBE2EF',
    background3:'#FFFFFF',
    foreground: '#FFFFFF',
    foreground2: '#000034',    
    foreground3: '#010169',
    phone: '#4CAF50',
    warning: '#F7B267',
    viewEvidence:'#388E3C',
    recapture:'#F57C00',
    requestStatus: {
      newRequest:'#DBE2EF',
      inProgress: '#F7B267',
      completed: '#4CAF50',
      newRequestText:'#000034',
      inProgressText: '#000034',
      completedText: '#FFFFFF',
      repairRequest: '#CA4502', 
      warrantyRequest: '#1E2F39',
      repairRequestText: '#FFFFFF',
      warrantyRequestText:'#FFFFFF',
    },
    shippingOrderStatus: {
      assignedOrder:'#0288D1',
      inProgress: '#F57C00',
      completed: '#4CAF50', 
      delayed: '#C62828', 
      assignedOrderText:'#FFFFFF',
      inProgressText: '#FFFFFF',
      completedText: '#FFFFFF',
      delayedText: '#FFFFFF',
    },
    requestPaymentStatus: {
      free: '#DBE2EF',
      freeText: '#000034',
      paid: '#FFD700',
      paidText:'#000034',
    },
    login: {
      error:'#FF0000'
    },
    danger: '#FF0000',
    danger1:'#8B0000'
  }
};


