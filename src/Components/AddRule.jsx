import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const mockUsers = [
  { id: "1", name: "Alice", ip: "192.168.1.2" },
  { id: "2", name: "Bob", ip: "192.168.1.3" },
  { id: "3", name: "Charlie", ip: "192.168.1.4" },
];

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
);

const AddRule = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockIP, setBlockIP] = useState("");
  const [blockedIPs, setBlockedIPs] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlockedIPs = async () => {
      if (!selectedUser) return;

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/rules/${selectedUser.id}`
        );
        setBlockedIPs((prev) => ({
          ...prev,
          [selectedUser.id]: data,
        }));
      } catch (err) {
        console.error(
          "Failed to fetch blocked IPs:",
          err.response?.data?.message || err.message
        );
      }
    };

    fetchBlockedIPs();
  }, [selectedUser]);

  const handleBlockIP = async () => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(blockIP)) {
      alert("Invalid IP address");
      return;
    }

    if (!selectedUser) return;

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/rules/add", {
        userId: selectedUser.id,
        blockedIP: blockIP,
      });

      setBlockedIPs((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), blockIP],
      }));
      setBlockIP("");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveIP = async (userId, ip) => {
    try {
      await axios.delete("http://localhost:5000/api/rules/delete", {
        data: {
          userId,
          blockedIP: ip,
        },
      });

      setBlockedIPs((prev) => {
        const updated = prev[userId].filter((x) => x !== ip);
        return {
          ...prev,
          [userId]: updated,
        };
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Users List */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Users & IPs</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className={`p-3 border rounded cursor-pointer ${
                selectedUser?.id === user.id
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.ip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Block IPs */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Block IP</h2>
        {selectedUser ? (
          <>
            <div className="mb-4">
              <div className="mb-2 text-gray-600">
                Selected User:{" "}
                <span className="font-semibold">{selectedUser.name}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter IP to block"
                  value={blockIP}
                  onChange={(e) => setBlockIP(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
                <button
                  onClick={handleBlockIP}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : "Block"}
                </button>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Blocked IPs:</div>
              <div className="flex flex-wrap gap-2"></div>
              {(blockedIPs[selectedUser.id] || []).map((ip, idx) => (
                <div
                  key={idx}
                  className="relative group bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
                >
                  {ip}
                  <button
                    onClick={() => handleRemoveIP(selectedUser.id, ip)}
                    className="absolute top-[-6px] right-[-6px] hidden group-hover:flex bg-red-600 text-white rounded-full w-4 h-4 text-xs items-center justify-center"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              {!blockedIPs[selectedUser.id]?.length && (
                <p className="text-sm text-gray-500">No IPs blocked yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Select a user to manage their blocked IPs
          </p>
        )}
      </div>
    </div>
  );
};

export default AddRule;
