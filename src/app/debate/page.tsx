const Debate = () => {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Live Debate</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">Video Feed</h2>
            <div className="mt-4 bg-gray-200 h-64 rounded">Video Stream</div>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">Chat</h2>
            <div className="mt-4 bg-gray-100 h-64 rounded overflow-y-scroll">
              <p className="p-2">[User1]: Hi there!</p>
              <p className="p-2">[User2]: Ready to start!</p>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="mt-4 w-full px-4 py-2 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default Debate;
  