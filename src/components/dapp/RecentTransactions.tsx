import React from 'react';

const transactions = [
  { id: 1, hash: '0x1439...5271', status: 'Confirmed', timestamp: '2 mins ago' },
  { id: 2, hash: '0x5972...9ybc', status: 'Confirmed', timestamp: '5 mins ago' },
  { id: 3, hash: '0x9afc...dcf0', status: 'Confirmed', timestamp: '10 mins ago' }
];

const RecentTransactions = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <div className="text-gray-300">
              <div className="font-medium">{tx.hash}</div>
              <div className="text-sm text-gray-400">{tx.timestamp}</div>
            </div>
            <div className="text-green-500">{tx.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;