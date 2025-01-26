import { useState } from 'react';
import { Users, Home, CreditCard, AlertCircle, Upload } from 'lucide-react';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { requests } = useMaintenanceStore();
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {});
          }).filter(item => Object.values(item).some(val => val));

          if (type === 'students') {
            setStudents(data);
            setShowStudentList(true);
            setShowRoomList(false);
          } else {
            setRooms(data);
            setShowRoomList(true);
            setShowStudentList(false);
          }
          toast.success(`${type === 'students' ? 'Student' : 'Room'} data imported successfully`);
        } catch (error) {
          toast.error('Error processing file. Please ensure it\'s a valid CSV.');
        }
      };
      reader.readAsText(file);
    }
  };

  const stats = [
    { 
      label: 'Total Students', 
      value: students.length || '150', 
      icon: Users, 
      color: 'bg-blue-500',
      onClick: () => setShowStudentList(true)
    },
    { 
      label: 'Total Rooms', 
      value: rooms.length || '50', 
      icon: Home, 
      color: 'bg-green-500',
      onClick: () => setShowRoomList(true)
    },
    { 
      label: 'Pending Payments', 
      value: '25', 
      icon: CreditCard, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Maintenance Requests', 
      value: requests.length, 
      icon: AlertCircle, 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white p-6 rounded-lg shadow-md ${stat.onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={stat.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Import Student Data</h3>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'students')}
              />
              <div className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                <Upload className="w-5 h-5" />
                <span>Upload CSV</span>
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500">Upload a CSV file with student details</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Import Room Data</h3>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'rooms')}
              />
              <div className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                <Upload className="w-5 h-5" />
                <span>Upload CSV</span>
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500">Upload a CSV file with room details</p>
        </div>
      </div>

      {/* Student List */}
      {showStudentList && students.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Student List</h3>
            <button 
              onClick={() => setShowStudentList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(students[0]).map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={index}>
                    {Object.values(student).map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Room List */}
      {showRoomList && rooms.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Room List</h3>
            <button 
              onClick={() => setShowRoomList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(rooms[0]).map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room, index) => (
                  <tr key={index}>
                    {Object.values(room).map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;