import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { CreditCard, Building, AlertCircle, PenTool as Tool } from 'lucide-react';
import MaintenanceRequestForm from '../../components/MaintenanceRequestForm';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount) => {
    setLoading(true);
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      setLoading(false);
      return;
    }

    const options = {
      key: 'rzp_test_TR59BRuVlXHiId',
      amount: amount * 100,
      currency: 'INR',
      name: 'Hostel Management System',
      description: 'Fee Payment',
      handler: function (response) {
        toast.success('Payment Successful!');
        console.log(response);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#4F46E5',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">Room Details</h3>
            </div>
            <p>Room Number: {user?.roomNumber}</p>
            <p>Type: Single Occupancy</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Payment Status</h3>
            </div>
            <p>Hostel Fee: Pending</p>
            <p>Mess Fee: Paid</p>
          </div>
          
          <div 
            className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
            onClick={() => setShowMaintenanceForm(true)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Tool className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold">Maintenance Request</h3>
            </div>
            <p>Click to submit a new request</p>
          </div>
        </div>
      </div>

      {showMaintenanceForm && (
        <MaintenanceRequestForm />
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Payment Section</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Hostel Fee</h4>
              <p className="text-gray-600">Due Amount: ₹25,000</p>
            </div>
            <button
              onClick={() => handlePayment(25000)}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Mess Fee</h4>
              <p className="text-gray-600">Due Amount: ₹5,000</p>
            </div>
            <button
              onClick={() => handlePayment(5000)}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;