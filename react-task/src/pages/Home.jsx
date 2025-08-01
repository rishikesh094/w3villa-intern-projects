

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-center px-4">
            <h1 className="text-4xl font-bold mb-4 text-blue-800">Welcome to TaskManager</h1>
            <p className="text-lg text-gray-700 mb-6">
                Manage your tasks efficiently with real-time sync and role-based access.
            </p>
            <div className="space-x-4">
                <a
                    href="/dashboard"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </a>
                <a
                    href="/create-task"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Task
                </a>
            </div>
        </div>
    );
};

export default Home;
