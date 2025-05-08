import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
);

const AddRule = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockDomain, setBlockDomain] = useState(""); // Changed from blockIP
  const [blockedDomains, setBlockedDomains] = useState({}); // Changed from blockedIPs
  const [blockDomain, setBlockDomain] = useState(""); // Changed from blockIP
  const [blockedDomains, setBlockedDomains] = useState({}); // Changed from blockedIPs
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null); // Change initial state to null
  const [users, setUsers] = useState(null); // Change initial state to null

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/users`);
        // Update this line to match the API response structure
        setUsers(data.client);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchBlockedIPs = async () => {
      if (!selectedUser) return;

      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/blocked-domains/${selectedUser.user_id}`
        );
        
        // Update to match the new API response structure
        setBlockedDomains((prev) => ({
        
        // Update to match the new API response structure
        setBlockedDomains((prev) => ({
          ...prev,
          [selectedUser.user_id]: data.blockedDomains
          [selectedUser.user_id]: data.blockedDomains
        }));
      } catch (err) {
        console.error(
          "Failed to fetch blocked domains:",
          "Failed to fetch blocked domains:",
          err.response?.data?.message || err.message
        );
        // Initialize empty array if no domains found
        setBlockedDomains((prev) => ({
          ...prev,
          [selectedUser.user_id]: []
        }));
        // Initialize empty array if no domains found
        setBlockedDomains((prev) => ({
          ...prev,
          [selectedUser.user_id]: []
        }));
      }
    };

    fetchBlockedIPs();
  }, [selectedUser]);

  const handleBlockDomain = async () => {
    // Remove IP validation and add basic domain validation
    
  const handleBlockDomain = async () => {
    // Remove IP validation and add basic domain validation
    

    if (!selectedUser) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/rules/add`, {
        userId: selectedUser.user_id, // Changed from userId to username
        domain: blockDomain, // Changed from blockedIP
      });

      setBlockedDomains((prev) => ({
      setBlockedDomains((prev) => ({
        ...prev,
        [selectedUser.user_id]: data.blockedDomains
        [selectedUser.user_id]: data.blockedDomains
      }));
      setBlockDomain("");
      setBlockDomain("");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveIP = async (userId, domain) => {
  const handleRemoveIP = async (userId, domain) => {
    try {
      await axios.delete(`${BASE_URL}/api/rules/delete`, {
        data: {
          userId,
          blockedDomain: domain, // Updated parameter name
          blockedDomain: domain, // Updated parameter name
        },
      });

      setBlockedDomains((prev) => {
        const updated = prev[userId].filter((d) => d !== domain);
      setBlockedDomains((prev) => {
        const updated = prev[userId].filter((d) => d !== domain);
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
          {!users ? (
            <div className="text-gray-500 text-center py-4">Loading users...</div>
          ) : users.length > 0 ? (
          {!users ? (
            <div className="text-gray-500 text-center py-4">Loading users...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.user_id}
                key={user.user_id}
                className={`p-3 border rounded cursor-pointer ${
                  selectedUser?.user_id === user.user_id
                  selectedUser?.user_id === user.user_id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.ip_address}</div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.ip_address}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No users found</div>
          )}
        </div>
      </div>

      {/* Block IPs */}
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Block Domain</h2>
        <h2 className="text-lg font-semibold mb-4">Block Domain</h2>
        {selectedUser ? (
          <>
            <div className="mb-4">
              <div className="mb-2 text-gray-600">
                Selected User:{" "}
                <span className="font-semibold">{selectedUser.name}</span>
                <span className="font-semibold">{selectedUser.name}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter domain (e.g., example.com)"
                  value={blockDomain}
                  onChange={(e) => setBlockDomain(e.target.value)}
                  placeholder="Enter domain (e.g., example.com)"
                  value={blockDomain}
                  onChange={(e) => setBlockDomain(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
                <button
                  onClick={handleBlockDomain}
                  onClick={handleBlockDomain}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : "Block"}
                </button>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Blocked Domains:</div>
              <div className="flex flex-wrap gap-2">
                {(blockedDomains[selectedUser.user_id] || []).map((domain, idx) => (
                  <div
                    key={idx}
                    className="relative group bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
                  >
                    {domain}
                    <button
                      onClick={() => handleRemoveIP(selectedUser.user_id, domain)}
                      className="absolute top-[-6px] right-[-6px] hidden group-hover:flex bg-red-600 text-white rounded-full w-4 h-4 text-xs items-center justify-center"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              {!blockedDomains[selectedUser.user_id]?.length && (
                <p className="text-sm text-gray-500">No domains blocked yet.</p>
              <div className="font-medium mb-2">Blocked Domains:</div>
              <div className="flex flex-wrap gap-2">
                {(blockedDomains[selectedUser.user_id] || []).map((domain, idx) => (
                  <div
                    key={idx}
                    className="relative group bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
                  >
                    {domain}
                    <button
                      onClick={() => handleRemoveIP(selectedUser.user_id, domain)}
                      className="absolute top-[-6px] right-[-6px] hidden group-hover:flex bg-red-600 text-white rounded-full w-4 h-4 text-xs items-center justify-center"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              {!blockedDomains[selectedUser.user_id]?.length && (
                <p className="text-sm text-gray-500">No domains blocked yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Select a user to manage their blocked domains
            Select a user to manage their blocked domains
          </p>
        )}
      </div>
    </div>
  );
};

export default AddRule;