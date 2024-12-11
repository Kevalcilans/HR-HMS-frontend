export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Humane Resource Management System
      </h1>
      <p className="text-lg text-gray-600">
        Please go to the{' '}
        <a
          href="/login"
          className="text-blue-500 font-semibold hover:text-blue-700"
        >
          Login
        </a>{' '}
        page.
      </p>
    </div>
  );
}
